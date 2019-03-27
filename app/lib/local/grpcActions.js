import * as grpc from 'grpc';

export const runCall = (reqConfig, callType) => {
  const { grpcURI, package, service, request, protoPath } = reqConfig;

  // load package definition
  const packageDefinition = grpc.packageDefinition(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  // load package
  const package = grpc.loadPackageDefinition(packageDefinition)[package];

  // create client
  const client = new package[service].

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
