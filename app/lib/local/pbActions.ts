import * as protoLoader from "@grpc/proto-loader";

export function loadProtoFile(protoPath: string): protoLoader.PackageDefinition | Error {
  try {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    return packageDefinition;
  } catch {
    return Error("Cannot load protofile");
  }
}

export function parsePackageDefinition(pkgDefn: protoLoader.PackageDefinition) {
  const protoMessages: {
    [index: string]: protoLoader.MessageTypeDefinition;
  } = {};
  const protoServices: { [index: string]: protoLoader.ServiceDefinition } = {};

  Object.entries(pkgDefn).forEach(entry => {
    const [key, value] = entry;
    // if the object has "fileDescriptorProtos", then it is a Service
    if (!Object.hasOwnProperty.call(value, "fileDescriptorProtos")) {
      protoServices[key] = <protoLoader.ServiceDefinition>value;
    } else {
      //@ts-ignore
      protoMessages[value.type.name] = <protoLoader.MessageTypeDefinition>value;
    }
  });

  return {
    protoServices,
    protoMessages,
  };
}
