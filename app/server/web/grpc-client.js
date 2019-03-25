const grpc = require('grpc');
const path = require('path');
const protoloader = require('@grpc/proto-loader');

//prep package definition
const packageDefinition = protoloader.loadSync(path.resolve(__dirname, '../protos/todo.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

//load package
const todo = grpc.loadPackageDefinition(packageDefinition).todo;

//create client
const client = new todo.ListActions('localhost:60000', grpc.credentials.createInsecure());

// **Functions** //

function runGetList(response) {
  client.GetList({}, (err, list) => {
    if (err) throw err;
    response.json(list.items)
  })
}

export default runGetList;