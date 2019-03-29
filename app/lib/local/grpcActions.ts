import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

export interface BaseConfig {
  grpcServerURI: string;
  packageDefinition: protoLoader.PackageDefinition;
  protoPackage: string;
  service: string;
}

export interface RequestConfig<
  T extends UnaryRequestBody | ClientStreamRequestBody
> {
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

export const runCall = (reqConfig: BaseConfig & RequestConfig<any>) => {
  const {
    grpcServerURI,
    packageDefinition,
    protoPackage,
    service,
    callType,
    method
  } = reqConfig;

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

  function clientStream(): Promise<{}> {
    // handle client stream
    const ClientStreamConfig: ClientStreamRequestBody = <
      ClientStreamRequestBody
    >reqConfig.reqBody;

    if (!clientStreamCall) {
      if (ClientStreamConfig.action === StreamAction.INITIATE) {
        clientStreamCall = client[method]((err, response) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        });
        clientStreamCall.write({ numb: 12 });
        clientStreamCall.end();
      }
    }

    if (ClientStreamConfig.action === StreamAction.SEND) {
      clientStreamCall.write(ClientStreamConfig.argument);
    }

    if (ClientStreamConfig.action === StreamAction.KILL) {
      clientStreamCall.end();
      clientStreamCall = undefined;
    }
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
};
