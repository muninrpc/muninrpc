import * as protoLoader from '@grpc/proto-loader';

/**
 *
 * @param {string} protoPath loads a protobuf file at the specified path.
 * @returns {packageDefinition} returns the package definition
 */

export const loadProtoFile = (
  protoPath: string
): protoLoader.PackageDefinition => {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  console.log(packageDefinition);
  return packageDefinition;
};

export const parsePackageDefinition = (
  pkgDefn: protoLoader.PackageDefinition
) => {
  const protoMessages = {};
  let protoServices = {};

  Object.values(pkgDefn).forEach(val => {
    if (!Object.hasOwnProperty.call(val, 'fileDescriptorProtos')) {
      // if the object lists the rpc methods
      protoServices = { ...val };
    } else {
      // if the object is the schema of a message
      protoMessages[val.type.name] = val.type;
    }
  });

  return {
    protoServices,
    protoMessages
  };
};
