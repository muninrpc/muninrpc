import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

//base config: properties that all config objects will have
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

//if the req body has an action, then it will maintain an open connection
export interface ClientStreamRequestBody {
  onEndCb: (a: any) => any;
}

export interface BidiAndServerStreamRequestBody {
  onDataCb: (a: any) => any;
  onEndCb: (a: any) => any;
}

//enums for the 4 types of calls
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

abstract class GrpcHandler<T extends void | ClientStreamRequestBody | BidiAndServerStreamRequestBody> {
  protected grpcServerURI: string;
  protected packageDefinition: protoLoader.PackageDefinition;
  protected packageName: string;
  protected serviceName: string;
  protected requestName: string;
  protected callType: string;
  protected requestConfig: void | ClientStreamRequestBody | BidiAndServerStreamRequestBody;
  protected loadedPackage: typeof grpc.Client;
  protected client: grpc.Client;
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

  //all handlers will be able to initiate a request
  abstract initiateRequest();

  //all handlers will close in the same way
  closeConnection() {
    this.client.close();
  }
}

class UnaryHandler extends GrpcHandler<void> {
  constructor(config: BaseConfig & RequestConfig<void>) {
    super(config);
  }

  /**
   * InitiateRequest will send the unary request to the gRPC server.
   * The argument sent is located in the configuration file
   */

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

class ClientStreamHandler extends GrpcHandler<ClientStreamRequestBody> {
  private onEndCb: (a: any) => any;
  private writableStream: grpc.ClientWritableStream<any>;

  constructor(config: BaseConfig & RequestConfig<ClientStreamRequestBody>) {
    super(config);
    this.onEndCb = config.streamConfig.onEndCb;
  }

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
      writableStream: this.writableStream,
    };
  }
}

abstract class SubjectGrpcHandler extends GrpcHandler<BidiAndServerStreamRequestBody> {
  private streamedData: object[];
  private observers: Observers[];
  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>) {
    super(config);
    this.streamedData = [];
    this.observers = [];
  }

  protected updateData(newData: object) {
    this.streamedData.push(newData);
  }

  public registerObservers(obs: Observers) {
    this.observers.push(obs);
  }

  protected notifyObservers(string?: "end") {
    this.observers.forEach(observer => {
      if (string === "end") {
        observer.finalUpdate(this.streamedData);
      } else {
        observer.update(this.streamedData);
      }
    });
  }
}

class ServerStreamHandler extends SubjectGrpcHandler {
  private onDataCb: (a: any) => any;
  private onEndCb: (a: any) => any;
  private readableStream: grpc.ClientReadableStream<any>;

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>) {
    super(config);
    this.onDataCb = config.streamConfig.onDataCb;
    this.onEndCb = config.streamConfig.onEndCb;
  }

  public initiateRequest() {
    this.readableStream = this.client[this.requestName](this.args);
    this.readableStream.on("data", (data: object) => {
      this.updateData(data);
      this.notifyObservers();
    });
    this.readableStream.on("end", data => {
      if (data) {
        this.updateData(data);
      }
      this.notifyObservers("end");
    });
  }
}

export class BidiStreamHandler extends SubjectGrpcHandler {
  private onDataCb: (a: any) => any;
  private onEndCb: (a: any) => any;
  private bidiStream: grpc.ClientDuplexStream<any, any>;

  constructor(config: BaseConfig & RequestConfig<BidiAndServerStreamRequestBody>) {
    super(config);
    this.onDataCb = config.streamConfig.onDataCb;
    this.onEndCb = config.streamConfig.onEndCb;
  }

  public initiateRequest() {
    this.bidiStream = this.client[this.requestName]();
    this.bidiStream.on("data", data => {
      this.updateData(data);
      this.notifyObservers();
    });
    this.bidiStream.on("end", data => {
      this.updateData(data);
      this.notifyObservers("end");
    });
    return this;
  }

  public returnHandler() {
    return {
      writableStream: this.bidiStream,
    };
  }
}

//factory function to create gRPC connections
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
