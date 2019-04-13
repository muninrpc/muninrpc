import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";
import { applyMixins } from "../../src/utils/";

//base config: properties that all config objects will have
export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  packageName: string; // ex: todo
  serviceName: string; // ex: ListActions
}

export interface RequestConfig<T extends void | ClientStreamCbs | BidiAndServerStreamCbs> {
  requestName: string;
  callType: CallType;
  argument: object;
  callbacks: T;
}

export interface ClientStreamCbs {
  // on end to fire of any render udpates or tests
  onEndReadCb: (a: any) => void;
  onDataWriteCb?: (a: any) => void;
}

export interface BidiAndServerStreamCbs {
  // on end to fire any intermediate render updates
  onDataReadCb: (a: any) => void;
  // on end to fire off any final render updates or tests
  onEndReadCb: (a: any) => void;
  onDataWriteCb?: (a: any) => void;
}

//enums for the 4 types of calls
export enum CallType {
  UNARY_CALL = "UNARY_CALL",
  CLIENT_STREAM = "CLIENT_STREAM",
  SERVER_STREAM = "SERVER_STREAM",
  BIDI_STREAM = "BIDI_STREAM",
}

class GrpcReader {
  data: { type: string; payload: object }[];
  // observers: Observer;
  onDataReadCb: (o: object[]) => void;
  onEndReadCb: (o: object[]) => void;

  updateReadData(newData: object) {
    this.data.push({ type: "read", payload: newData });
  }

  // registerObservers(obs: Observer) {
  // this.observers = obs;
  // }

  notifyObservers(type: string, string?: "end") {
    if (type === "read") {
      if (string === "end") {
        this.onEndReadCb(this.data);
      } else {
        this.onDataReadCb(this.data);
      }
    }
  }
}

class GrpcWriter {
  data: { type: string; payload: object }[];
  // observers: Observer;
  onDataWriteCb: (data: object) => void;

  updateWriteData(newData: object) {
    this.data.push({ type: "write", payload: newData });
  }

  // registerObservers(obs: Observer) {
  // this.observers = obs;
  // }

  notifyObservers(type: string) {
    if (type === "write") {
      this.onDataWriteCb(this.data);
    }
  }

  upgradeWrite(base: grpc.ClientWritableStream<any>) {
    const _baseWrite = base.write;
    const upgradedWrite = (data: object) => {
      const result = _baseWrite.call(base, data);
      if (result) {
        this.updateWriteData({ type: "write", payload: data });
        this.notifyObservers("write");
      }
      return result;
    };
    base.write = upgradedWrite;
    return base;
  }
}

abstract class GrpcHandler {
  // protected grpcServerURI: string;
  // protected packageDefinition: protoLoader.PackageDefinition;
  protected packageName: string;
  protected serviceName: string;
  protected requestName: string;
  // protected callType: string;

  protected loadedPackage: typeof grpc.Client;
  public client: grpc.Client;
  protected args: object;

  constructor(config: BaseConfig & RequestConfig<any>) {
    // this.grpcServerURI = config.grpcServerURI;
    // this.packageDefinition = config.packageDefinition;
    this.packageName = config.packageName;
    this.serviceName = config.serviceName;

    this.requestName = config.requestName;
    this.loadedPackage = grpc.loadPackageDefinition(config.packageDefinition)[this.packageName] as typeof grpc.Client;
    this.args = config.argument;
    this.client = new this.loadedPackage[this.serviceName](
      config.grpcServerURI,
      grpc.credentials.createInsecure(),
    ) as grpc.Client;
  }

  //all handlers will be able to initiate a request
  abstract initiateRequest();

  //all handlers will close in the same way
  closeConnection() {
    this.client.close();
  }
}

class UnaryHandler extends GrpcHandler {
  constructor(config: BaseConfig & RequestConfig<void>) {
    super(config);
  }

  public initiateRequest(): Promise<{}> {
    return new Promise((resolve, reject) => {
      console.log(this.args)
      this.client[this.requestName](this.args, (err: Error, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}

class ClientStreamHandler extends GrpcHandler implements GrpcWriter {
  private onEndReadCb: (a: any) => any;
  public onDataWriteCb: (data: object) => void;
  private writableStream: grpc.ClientWritableStream<any>;
  public data: { type: string; payload: object }[];
  // public observers: Observer;

  constructor(config: BaseConfig & RequestConfig<ClientStreamCbs>) {
    super(config);
    this.onEndReadCb = config.callbacks.onEndReadCb;
    this.onDataWriteCb = config.callbacks.onDataWriteCb;
    this.data = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateWriteData: () => void;
  // registerObservers: (o: Observer) => void;
  notifyObservers: (type: string) => void;
  upgradeWrite: (base: grpc.ClientWritableStream<any>) => grpc.ClientWritableStream<any>;

  public initiateRequest() {
    
    this.writableStream = this.client[this.requestName]((err, response) => {
      if (err) {
        throw err;
      }
      this.onEndReadCb(response);
    });
    return this;
  }

  public returnHandler() {
    return {
      writableStream: this.upgradeWrite(this.writableStream),
    };
  }
}

class ServerStreamHandler extends GrpcHandler implements GrpcReader {
  public onDataReadCb: (a: object) => void;
  public onEndReadCb: (a: object) => void;
  private readableStream: grpc.ClientReadableStream<any>;
  public data: { type: string; payload: object }[];
  // public observers: Observer;

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamCbs>) {
    super(config);
    this.onDataReadCb = config.callbacks.onDataReadCb;
    this.onEndReadCb = config.callbacks.onEndReadCb;
    this.data = [];
    // this.observers = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateReadData: (a: any) => void;
  registerObservers: (o: Observer) => void;
  notifyObservers: (type: string, string?: "end") => void;

  public initiateRequest() {
    this.readableStream = this.client[this.requestName](this.args);
    this.readableStream.on("data", (data: object) => {
      this.updateReadData(data);
      this.notifyObservers("read");
    });
    this.readableStream.on("end", data => {
      this.updateReadData(data);
      this.notifyObservers("read", "end");
    });
  }
}

type GrpcReaderWriter = GrpcReader & GrpcWriter;

class BidiStreamHandler extends GrpcHandler implements GrpcReaderWriter {
  public onDataReadCb: (a: any) => any;
  public onEndReadCb: (a: any) => any;
  public onDataWriteCb: (a: any) => void;
  private bidiStream: grpc.ClientDuplexStream<any, any>;
  public data: { type: string; payload: object }[];
  // public observers: Observers[];

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamCbs>) {
    super(config);
    this.onDataReadCb = config.callbacks.onDataReadCb;
    this.onEndReadCb = config.callbacks.onEndReadCb;
    this.data = [];
    // this.observers = [];
  }

  // create stand-in properties and methods to initially satisfy the interface contract
  // mixins will be used to properly assign functionality
  updateReadData: (newData: object) => void;
  updateWriteData: (newData: object) => void;
  // registerObservers: (o: Observers) => void;
  notifyObservers: (type: string, string?: "end") => void;
  upgradeWrite: (base: grpc.ClientWritableStream<any>) => grpc.ClientWritableStream<any>;

  public initiateRequest() {
    this.bidiStream = this.client[this.requestName]();
    this.bidiStream.on("data", data => {
      this.updateReadData(data);
      this.notifyObservers("read");
    });
    this.bidiStream.on("end", data => {
      if (data) {
        this.updateReadData(data);
      }
      this.notifyObservers("read", "end");
    });
    return this;
  }

  public returnHandler() {
    return {
      writableStream: this.upgradeWrite(this.bidiStream),
    };
  }
}

//factory function to create gRPC connections
export class GrpcHandlerFactory {
  static createHandler(
    config: BaseConfig & RequestConfig<BidiAndServerStreamCbs>,
  ): BidiStreamHandler | ServerStreamHandler;
  static createHandler(config: BaseConfig & RequestConfig<ClientStreamCbs>): ClientStreamHandler;
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
