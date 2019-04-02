import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  packageName: string;
  serviceName: string;
}

export interface RequestConfig<
  T extends
    | UnaryRequestBody
    | ClientStreamRequestBody
    | ServerStreamRequestBody
    | BidiStreamRequestBody
> {
  requestName: string;
  callType: CallType;
  reqBody: T;
}
export interface UnaryRequestBody {
  argument: object;
}

export interface ClientStreamRequestBody {
  action: StreamAction;
  argument?: object;
  callback?: (a: any) => any;
}

export interface ServerStreamRequestBody {
  action: StreamAction;
  argument?: object;
  callback?: (a: any) => any;
}

export interface BidiStreamRequestBody {
  action: StreamAction;
  argument?: object;
  callback?: (a: any) => any;
}

export enum StreamAction {
  INITIATE,
  SEND,
  KILL
}

export enum CallType {
  UNARY_CALL = "UNARY_CALL",
  CLIENT_STREAM = "CLIENT_STREAM",
  SERVER_STREAM = "SERVER_STREAM",
  BIDI_STREAM = "BIDI_STREAM"
}

abstract class GrpcHandler<
  T extends
    | UnaryRequestBody
    | ClientStreamRequestBody
    | ServerStreamRequestBody
    | BidiStreamRequestBody
> {
  protected grpcServerURI: string;
  protected packageDefinition: protoLoader.PackageDefinition;
  protected packageName: string;
  protected serviceName: string;
  protected requestName: string;
  protected callType: string;
  protected requestConfig:
    | UnaryRequestBody
    | ClientStreamRequestBody
    | ServerStreamRequestBody
    | BidiStreamRequestBody;
  protected loadedPackage: typeof grpc.Client;
  protected client: grpc.Client;

  constructor(config: BaseConfig & RequestConfig<T>) {
    this.grpcServerURI = config.grpcServerURI;
    this.packageDefinition = config.packageDefinition;
    this.packageName = config.packageName;
    this.serviceName = config.serviceName;
    this.requestConfig = config.reqBody;
    this.requestName = config.requestName;
    this.loadedPackage = grpc.loadPackageDefinition(this.packageDefinition)[
      this.packageName
    ] as typeof grpc.Client;
    this.client = new this.loadedPackage[this.serviceName](
      this.grpcServerURI,
      grpc.credentials.createInsecure()
    ) as grpc.Client;
  }

  abstract initiateRequest();

  closeConnection() {
    this.client.close();
  }
}

class UnaryHandler extends GrpcHandler<UnaryRequestBody> {
  private args: object;
  constructor(config: BaseConfig & RequestConfig<UnaryRequestBody>) {
    super(config);
    this.args = this.requestConfig.argument;
  }

  /**
   * InitiateRequest will send the unary request to the gRPC server.
   * The argument sent is located in the configuration file
   */

  initiateRequest(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.client[this.requestName](this.args, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }
}

class ClientStreamHandler extends GrpcHandler<ClientStreamRequestBody> {
  private cb: (a: any) => any;
  private writableStream: grpc.ClientWritableStream<any>;

  constructor(config: BaseConfig & RequestConfig<ClientStreamRequestBody>) {
    super(config);
    this.cb = config.reqBody.callback;
    this.initiateRequest();
  }

  initiateRequest() {
    this.writableStream = this.client[this.requestName]((err, response) => {
      if (err) {
        throw err;
      }
      this.cb(response);
    });
  }
  returnHandler() {
    return {
      writableStream: this.writableStream
    };
  }
}

class ServerStreamHandler extends GrpcHandler<ServerStreamRequestBody> {
  public cb: (a: any) => any;
  public readableStream: grpc.ClientReadableStream<any>;

  constructor(config: BaseConfig & RequestConfig<ServerStreamRequestBody>) {
    super(config);
    this.cb = config.reqBody.callback;
    this.initiateRequest();
  }

  initiateRequest() {
    this.readableStream = this.client[this.requestName](this.requestConfig.argument);
    this.readableStream.on("data", data => {
      this.cb(data);
    });
    this.readableStream.on("end", () => {
      console.log("Connection Closed");
    });
  }
}

class BidiStreamHandler extends GrpcHandler<BidiStreamRequestBody> {
  public cb: (a: any) => any;
  public bidiStream: grpc.ClientDuplexStream<any, any>;

  constructor(config: BaseConfig & RequestConfig<BidiStreamRequestBody>) {
    super(config);
    this.cb = config.reqBody.callback;
    this.initiateRequest();
  }

  initiateRequest() {
    this.bidiStream = this.client[this.requestName];
    this.bidiStream.on("data", data => {
      this.cb(data);
    });
    this.bidiStream.on("end", () => {
      console.log("Connection Closed");
    });
  }
  returnHandler() {
    return {
      bidiStream: this.bidiStream
    };
  }
}

export class GrpcHandlerFactory {
  static createHandler(config: BaseConfig & RequestConfig<UnaryRequestBody>): UnaryHandler;
  static createHandler(
    config: BaseConfig & RequestConfig<ClientStreamRequestBody>
  ): ClientStreamHandler;
  static createHandler(
    config: BaseConfig & RequestConfig<ServerStreamRequestBody>
  ): ServerStreamHandler;
  static createHandler(
    config: BaseConfig & RequestConfig<BidiStreamRequestBody>
  ): BidiStreamHandler;
  static createHandler(config: BaseConfig & RequestConfig<any>) {
    switch (config.callType) {
      case CallType.UNARY_CALL: {
        return new UnaryHandler(config);
      }
      case CallType.CLIENT_STREAM: {
        return new ClientStreamHandler(config);
      }
      case CallType.SERVER_STREAM: {
        return new ServerStreamHandler(config);
      }
      case CallType.BIDI_STREAM: {
        return new BidiStreamHandler(config);
      }
    }
  }
}
