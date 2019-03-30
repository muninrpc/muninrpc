import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  protoPackage: string;
  service: string;
}

export interface RequestConfig<T extends UnaryRequestBody | ClientStreamRequestBody> {
  method: string;
  callType: CallType;
  reqBody: T;
  // | ServerStreamRequestBody
  // | BidiStreamRequestBody;
}
export interface UnaryRequestBody {
  argument: object;
}

export interface ClientStreamRequestBody {
  action: StreamAction;
  argument?: object;
  callback?: (a: any) => any;
}

// interface ServerStreamRequestBody {
//   //
// }

// interface BidiStreamRequestBody {
//   //
// }

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

export function runCall(reqConfig: BaseConfig & RequestConfig<UnaryRequestBody>): Promise<{}>;
export function runCall(
  reqConfig: BaseConfig & RequestConfig<ClientStreamRequestBody>
): {
  writableStream: grpc.ClientWritableStream<any>;
  ender: () => void;
};
export function runCall(reqConfig) {
  const { grpcServerURI, packageDefinition, protoPackage, service, callType, method } = reqConfig;

  // declare variables to store streams using closure
  let clientStreamCall: grpc.ClientWritableStream<any>;

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

    if (!clientStreamCall) {
      if (ClientStreamConfig.action === StreamAction.INITIATE) {
        console.log("should be first");
        clientStreamCall = client[method]((err, response) => {
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
      writableStream: clientStreamCall,
      ender: () => {
        clientStreamCall.end();
        clientStreamCall = undefined;
      }
    };
  }

  function serverStream() {
    // handle serverStream
  }

  function bidiStream() {
    // handle bidirectional stream
  }

  switch (callType) {
    case CallType.UNARY_CALL: {
      return unaryCall();
    }
    case CallType.CLIENT_STREAM: {
      return clientStream();
    }
  }
}
