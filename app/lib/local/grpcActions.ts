import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  protoPackage: string;
  service: string;
}

export interface RequestConfig<
  T extends
    | UnaryRequestBody
    | ClientStreamRequestBody
    | ServerStreamRequestBody
    | BidiStreamRequestBody
> {
  method: string;
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
  arguments?: object;
  callback?: (a: any) => any;
}

export interface BidiStreamRequestBody {
  action: StreamAction;
  arguments?: object;
  callback?: (a: any) => any;
}

export enum StreamAction {
  INITIATE,
  SEND,
  KILL
}

export enum CallType {
  UNARY_CALL,
  CLIENT_STREAM,
  SERVER_STREAM,
  BIDI_STREAM
}

// method overloads
export function runCall(reqConfig: BaseConfig & RequestConfig<UnaryRequestBody>): Promise<{}>;
export function runCall(
  reqConfig: BaseConfig & RequestConfig<ClientStreamRequestBody>
): {
  writableStream: grpc.ClientWritableStream<any>;
  ender: () => void;
};
export function runCall(reqConfig: BaseConfig & RequestConfig<ServerStreamRequestBody>): void;
export function runCall(
  reqConfig: BaseConfig & RequestConfig<BidiStreamRequestBody>
): {
  writableStream: grpc.ClientWritableStream<any>;
  readableStream: grpc.ClientReadableStream<any>;
  ender: () => void;
};
export function runCall(reqConfig) {
  const { grpcServerURI, packageDefinition, protoPackage, service, callType, method } = reqConfig;

  // declare variables to store streams using closure
  let clientStreamCaller: grpc.ClientWritableStream<any>;
  let serverStreamCaller: grpc.ClientReadableStream<any>;
  let bidiStreamCaller: grpc.ClientDuplexStream<any, any>;

  // load package
  const loadedPackage = <typeof grpc.Client>(
    grpc.loadPackageDefinition(packageDefinition)[protoPackage]
  );

  // create client
  const client = new loadedPackage[service](
    grpcServerURI,
    grpc.credentials.createInsecure()
  ) as grpc.Client;

  function unaryCall(): Promise<{}> {
    const args = reqConfig.reqBody.argument;
    return new Promise((resolve, reject) => {
      client[method](args, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  function clientStream(): {
    writableStream: grpc.ClientWritableStream<any>;
    ender: () => void;
  } {
    // handle client stream
    const ClientStreamConfig: ClientStreamRequestBody = <ClientStreamRequestBody>reqConfig.reqBody;

    const cb = ClientStreamConfig.callback;

    if (!clientStreamCaller) {
      if (ClientStreamConfig.action === StreamAction.INITIATE) {
        clientStreamCaller = client[method]((err, response) => {
          if (err) {
            throw err;
          }
          cb(response);
        });
        // clientStreamCall.write({ numb: 12 });
        // clientStreamCall.end();
      }
    }

    return {
      writableStream: clientStreamCaller,
      ender: () => {
        clientStreamCaller.end();
        clientStreamCaller = undefined;
      }
    };
  }

  function serverStream(): void {
    const ServerStreamConfig: ServerStreamRequestBody = <ServerStreamRequestBody>reqConfig.reqBody;
    const cb = ServerStreamConfig.callback;

    if (!serverStreamCaller && ServerStreamConfig.action === StreamAction.INITIATE) {
      // to do: check to ensure that arguments are the proper shape
      serverStreamCaller = client[method]([ServerStreamConfig.arguments]);
    }

    serverStreamCaller.on("data", data => {
      console.log(data);
    });

    serverStreamCaller.on("end", cb);
  }

  function bidiStream() {
    // handle bidirectional stream
    const ClientStreamConfig: BidiStreamRequestBody = <BidiStreamRequestBody>reqConfig.reqBody;

    const cb = ClientStreamConfig.callback;

    if (!bidiStreamCaller && ClientStreamConfig.action === StreamAction.INITIATE) {
      bidiStreamCaller = client[method];
    }

    bidiStreamCaller.end(cb);

    return {
      writableStream: bidiStreamCaller,
      ender: () => {
        bidiStreamCaller.end();
        bidiStreamCaller = undefined;
      }
    };
  }

  switch (callType) {
    case CallType.UNARY_CALL: {
      return unaryCall();
    }
    case CallType.CLIENT_STREAM: {
      return clientStream();
    }
    case CallType.SERVER_STREAM: {
      return serverStream();
    }
    case CallType.BIDI_STREAM: {
      return bidiStream();
    }
  }
}
