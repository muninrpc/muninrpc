import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import { applyMixins } from "../../src/utils/";

export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  packageName: string; // ex: todo
  serviceName: string; // ex: ListActions
}

export interface RequestConfig<T extends ClientStreamRequestBody | BidiAndServerStreamRequestBody | void> {
  requestName: string;
  callType: CallType;
  argument: object;
  streamConfig?: T;
}

export interface ClientStreamRequestBody {
  onEndCb: (a: any) => any;
}

export interface BidiAndServerStreamRequestBody {
  onDataCb: (a: any) => any;
  onEndCb: (a: any) => any;
}

export enum CallType {
  UNARY_CALL = "UNARY_CALL",
  CLIENT_STREAM = "CLIENT_STREAM",
  SERVER_STREAM = "SERVER_STREAM",
  BIDI_STREAM = "BIDI_STREAM",
}

export interface Observers {
  update: (o: object[]) => any;
  finalUpdate: (o: object[]) => any;
}

class GrpcReader {
  data: { type: string; payload: object }[];
  observers: Observers[];

  updateReadData(newData: object) {
    this.data.push({ type: "read", payload: newData });
  }

  registerObservers(obs: Observers) {
    this.observers.push(obs);
  }

  notifyObservers(string?: "end") {
    this.observers.forEach(observer => {
      if (string === "end") {
        observer.finalUpdate(this.data);
      } else {
        observer.update(this.data);
      }
    });
  }
}

class GrpcWriter {
  data: { type: string; payload: object }[];
  observers: Observers[];

  updateWriteData(newData: any) {
    console.log("inside updateWriteData", this);
    this.data.push(newData);
  }

  registerObservers(obs: Observers) {
    this.observers.push(obs);
  }

  notifyObservers(string?: "end") {
    this.observers.forEach(observer => {
      if (string === "end") {
        observer.finalUpdate(this.data);
      } else {
        observer.update(this.data);
      }
    });
  }

  upgradeWrite(base: grpc.ClientWritableStream<any>) {
    const _baseWrite = base.write;
    const upgradedWrite = (data: object) => {
      this.updateWriteData({ type: "write", payload: data });
      return _baseWrite.call(base, data);
    };
    base.write = upgradedWrite;
    return base;
  }
}

abstract class GrpcHandler<T extends void | ClientStreamRequestBody | BidiAndServerStreamRequestBody> {
  protected grpcServerURI: string;
  protected packageDefinition: protoLoader.PackageDefinition;
  protected packageName: string;
  protected serviceName: string;
  protected requestName: string;
  protected callType: string;
  protected requestConfig: void | ClientStreamRequestBody | BidiAndServerStreamRequestBody;
  protected loadedPackage: typeof grpc.Client;
  public client: grpc.Client;
  protected args: object;

  constructor(config: BaseConfig & RequestConfig<T>) {
    this.grpcServerURI = config.grpcServerURI;
    this.packageDefinition = config.packageDefinition;
    this.packageName = config.packageName;
    this.serviceName = config.serviceName;
    this.requestConfig = config.streamConfig;
    this.requestName = config.requestName;
    this.loadedPackage = grpc.loadPackageDefinition(this.packageDefinition)[this.packageName] as typeof grpc.Client;
    this.args = config.argument;
    this.client = new this.loadedPackage[this.serviceName](
      this.grpcServerURI,
      grpc.credentials.createInsecure(),
    ) as grpc.Client;
  }

  abstract initiateRequest();

  closeConnection() {
    this.client.close();
  }
}

class UnaryHandler extends GrpcHandler<void> {
  constructor(config: BaseConfig & RequestConfig<void>) {
    super(config);
  }

  public initiateRequest(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.client[this.requestName](this.args, (err: Error, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}

class ClientStreamHandler extends GrpcHandler<ClientStreamRequestBody> implements GrpcWriter {
  private onEndCb: (a: any) => any;
  private writableStream: grpc.ClientWritableStream<any>;
  public data: { type: string; payload: object }[];
  public observers: Observers[];

  constructor(config: BaseConfig & RequestConfig<ClientStreamRequestBody>) {
    super(config);
    this.onEndCb = config.streamConfig.onEndCb;
    this.data = [];
    this.observers = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateWriteData: () => void;
  registerObservers: (o: Observers) => void;
  notifyObservers: () => void;
  upgradeWrite: (base: grpc.ClientWritableStream<any>) => grpc.ClientWritableStream<any>;

  public initiateRequest() {
    this.writableStream = this.client[this.requestName]((err, response) => {
      if (err) {
        throw err;
      }
      this.onEndCb(response);
    });
    return this;
  }

  public returnHandler() {
    return {
      writableStream: this.upgradeWrite(this.writableStream),
    };
  }
}

class ServerStreamHandler extends GrpcHandler<BidiAndServerStreamRequestBody> implements GrpcReader {
  private onDataCb: (a: any) => any;
  private onEndCb: (a: any) => any;
  private readableStream: grpc.ClientReadableStream<any>;
  public data: { type: string; payload: object }[];
  public observers: Observers[];

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>) {
    super(config);
    this.onDataCb = config.streamConfig.onDataCb;
    this.onEndCb = config.streamConfig.onEndCb;
    this.data = [];
    this.observers = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateReadData: (a: any) => void;
  registerObservers: (o: Observers) => void;
  notifyObservers: (a?: any) => void;

  public initiateRequest() {
    this.readableStream = this.client[this.requestName](this.args);
    this.readableStream.on("data", (data: object) => {
      this.updateReadData(data);
      this.notifyObservers();
    });
    this.readableStream.on("end", data => {
      if (data) {
        this.updateReadData(data);
      }
      this.notifyObservers("end");
    });
  }
}

class BidiStreamHandler extends GrpcHandler<BidiAndServerStreamRequestBody> implements GrpcReader, GrpcWriter {
  private onDataCb: (a: any) => any;
  private onEndCb: (a: any) => any;
  private bidiStream: grpc.ClientDuplexStream<any, any>;
  public data: { type: string; payload: object }[];
  public observers: Observers[];

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>) {
    super(config);
    this.onDataCb = config.streamConfig.onDataCb;
    this.onEndCb = config.streamConfig.onEndCb;
    this.data = [];
    this.observers = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateReadData: (a: any) => void;
  updateWriteData: (a: any) => void;
  registerObservers: (o: Observers) => void;
  notifyObservers: (a?: any) => void;
  upgradeWrite: (base: grpc.ClientWritableStream<any>) => grpc.ClientWritableStream<any>;

  public initiateRequest() {
    this.bidiStream = this.client[this.requestName]();
    this.bidiStream.on("data", data => {
      this.updateReadData(data);
      this.notifyObservers();
    });
    this.bidiStream.on("end", data => {
      if (data) {
        this.updateReadData(data);
      }
      this.notifyObservers("end");
    });
    return this;
  }

  public returnHandler() {
    return {
      writableStream: this.upgradeWrite(this.bidiStream),
    };
  }
}

export class GrpcHandlerFactory {
  static createHandler(
    config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>,
  ): BidiStreamHandler | ServerStreamHandler;
  static createHandler(config: BaseConfig & RequestConfig<ClientStreamRequestBody>): ClientStreamHandler;
  static createHandler(config: BaseConfig & RequestConfig<void>): UnaryHandler;
  static createHandler(config: BaseConfig & RequestConfig<any>) {
    if (config.callType === CallType.UNARY_CALL) {
      return new UnaryHandler(config);
    }
    if (config.callType === CallType.CLIENT_STREAM) {
      return new ClientStreamHandler(config);
    }
    if (config.callType === CallType.SERVER_STREAM) {
      return new ServerStreamHandler(config);
    }
    if (config.callType === CallType.BIDI_STREAM) {
      return new BidiStreamHandler(config);
    }
  }
}

applyMixins(ClientStreamHandler, [GrpcWriter]);
applyMixins(ServerStreamHandler, [GrpcReader]);
applyMixins(BidiStreamHandler, [GrpcWriter, GrpcReader]);
