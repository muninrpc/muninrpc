import * as grpc from 'grpc';

export const runCall = (reqConfig, callType) => {
  let { grpcURI, pkg, service, request, protoPath } = reqConfig;

  // load package definition
  // @ts-ignore
  const packageDefinition = grpc.packageDefinition(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  // load package
  const package1 = grpc.loadPackageDefinition(packageDefinition)[pkg];

  // create client
  // const client = new package[service].

  function unaryCall() {
    // handle unaryCall
  }

  function clientStream() {
    // handle client stream
  }

  function serverStream() {
    // handle serverStream
  }

  function bidiStream() {
    // handle bidirectional stream
  }
};
