const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../protos/todo.proto');
const grpc = require('grpc');
const async = require('async');

const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const todo = grpc.loadPackageDefinition(packageDefinition).todo;

const client = new todo.ListActions(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

/**
 *
 * @param {function} cb called to perform actions using the list data
 */

module.exports = {
  runGetList: res => {
    client.GetList({}, (err, list) => {
      if (err) {
        throw err;
      }
      res.json(list.items);
    });
  },
  runAddNewToDo: (newToDo, res) => {
    client.AddItem(newToDo, (err, list) => {
      if (err) {
        throw err;
      }
      res.json(list.items);
    });
  }
};
