import * as protoLoader from "@grpc/proto-loader";

/**
 *
 * @param {string} protoPath loads a protobuf file at the specified path.
 * @returns {packageDefinition} returns the package definition
 */

//loads and configures a proto file
//takes a file path to a .proto file as an argument
export function loadProtoFile(protoPath: string): protoLoader.PackageDefinition | Error {
  try {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    //returns a pckg definition
    return packageDefinition;
  } catch {
    return Error("Cannot load protofile");
  }
}

//parses a pkg definition
export function parsePackageDefinition(pkgDefn: protoLoader.PackageDefinition) {
  //initialize empty objects for both proto file messages and services
  const protoMessages: {
    [index: string]: protoLoader.MessageTypeDefinition;
  } = {};
  const protoServices: { [index: string]: protoLoader.ServiceDefinition } = {};

  // iterate thru the package definition
  Object.entries(pkgDefn).forEach(entry => {
    const [key, value] = entry;
    // if the object has "fileDescriptorProtos", then it is a Service
    if (!Object.hasOwnProperty.call(value, "fileDescriptorProtos")) {
      // if the object lists the rpc methods
      protoServices[key] = <protoLoader.ServiceDefinition>value;
    } else {
      //if the object does not have "fileDescriptorProtos", then it is a Message
      // if the object is the schema of a message
      //@ts-ignore
      protoMessages[value.type.name] = <protoLoader.MessageTypeDefinition>value;
    }
  });

  // return an object with all the Messages and Services/Requests inside it
  return {
    protoServices,
    protoMessages,
  };
}
