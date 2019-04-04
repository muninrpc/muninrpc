import * as protoLoader from "@grpc/proto-loader";

/**
 *
 * @param {string} protoPath loads a protobuf file at the specified path.
 * @returns {packageDefinition} returns the package definition
 */

export function loadProtoFile(protoPath: string): protoLoader.PackageDefinition {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  // console.log(packageDefinition);
  return packageDefinition;
}

export function parsePackageDefinition(pkgDefn: protoLoader.PackageDefinition) {
  const protoMessages: {
    [index: string]: protoLoader.MessageTypeDefinition;
  } = {};
  const protoServices: { [index: string]: protoLoader.ServiceDefinition } = {};

  Object.entries(pkgDefn).forEach(entry => {
    const [key, value] = entry;
    if (!Object.hasOwnProperty.call(value, "fileDescriptorProtos")) {
      // if the object lists the rpc methods
      protoServices[key] = <protoLoader.ServiceDefinition>value;
    } else {
      // if the object is the schema of a message
      //@ts-ignore
      protoMessages[value.type.name] = <protoLoader.MessageTypeDefinition>value;
    }
  });

  return {
    protoServices,
    protoMessages,
  };
}
