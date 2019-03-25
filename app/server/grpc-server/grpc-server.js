const path = require('path');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader')

//prep pckg def
const packageDefinition = grpc.packageDefinition(path.resolve(__dirname, '../protos/todo.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

//load pckg
const todo = grpc.loadPackageDefinition(packageDefinition).todo;

const database = [];

// **Functions** //
function GetList(call, callback){
  callback(null, {
    items: database
  })
}

//preconfigures a server with all the services on it, before you use it
function getServer(){
  const server = new grpc.Server();
  server.addService(todo.ListActions.service, {
    GetList: GetList
    //other methods/services would go here
  });
  return server;
}

if (require.main === module) {
  //create a pre-configured server
  var routeServer = getServer();
  routeServer.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());
  routeServer.start();
}

export default getServer;