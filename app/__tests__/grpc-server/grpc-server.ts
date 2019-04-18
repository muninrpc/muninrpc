const path = require("path");
const PROTO_PATH = path.resolve(__dirname, "./protos/todo.proto");
import * as grpc from "grpc";
const async = require("async");
import * as _ from "lodash";

const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todo_proto = grpc.loadPackageDefinition(packageDefinition).todo;

const toDoList = [{ item: "clean the house" }, { item: "do laundry" }];

/**
 *
 * Unary Calls
 *
 */

function GetList(call, callback) {
  callback(null, { items: toDoList });
}

function AddItem(call, callback) {
  toDoList.push(call.request);
  callback(null, { items: toDoList });
}

/**
 *
 * Client side streamining
 */

function CalculateAverage(call: grpc.ServerReadableStream<any>, callback: grpc.requestCallback<{ average: number }>) {
  const numCache = [];
  call.on("data", data => {
    numCache.push(data.numb);
  });
  call.on("end", () => {
    const average = numCache.reduce((acc, curr) => acc + curr) / numCache.length;
    callback(null, { average });
  });
}

/**
 *
 *  Server side streaming
 *
 */

function TestServerStream(call: grpc.ServerWriteableStream<any>) {
  call.on("cancelled", () => {
    call.end();
  });
  const sendThis = [3, 3, 3, 3, 3];
  sendThis.forEach(msg => {
    call.write({ numb: msg });
  });
  call.end();
  // const stopID = setInterval(() => {
  //   const randomInt = Math.floor(Math.random() * 100);
  //   call.write({ numb: 3 });
  // }, 100);
  // setTimeout(() => {
  //   clearInterval(stopID);
  //   call.end();
  // }, 1000 * 0.6);
}

/**
 *
 * Bi-directional Streaming
 *
 */

function ItemStreamer(call: grpc.ServerDuplexStream<any, any>) {
  let counter = 0;
  call.on("data", msg => {
    call.write({ msg: `${msg.item} - count: ${counter++}` });
  });
  call.on("end", () => {
    call.end();
  });
}

export function getServer(): grpc.Server {
  const server = new grpc.Server();
  server.addService(todo_proto.ListActions.service, {
    GetList: GetList,
    AddItem: AddItem,
    ItemStreamer: ItemStreamer,
    CalculateAverage: CalculateAverage,
    TestServerStream: TestServerStream,
  });
  return server;
}

if (require.main === module) {
  const routeServer = getServer();
  routeServer.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
  routeServer.start();
}
