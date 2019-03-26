import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';

/**
 *
 * @param {string} protoPath loads a protobuf file at the specified path.
 */
export const loadProtoFile = protoPath => {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
  console.log(packageDefinition);
};
