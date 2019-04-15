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
  console.log("Getting List of ToDo's");
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
    console.log("receiving data:", data);
    numCache.push(data.numb);
  });
  call.on("end", () => {
    const average = numCache.reduce((acc, curr) => acc + curr) / numCache.length;
    console.log("received end request");
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
    console.log("client cancelled");
    call.end();
  });
  const stopID = setInterval(() => {
    const randomInt = Math.floor(Math.random() * 100);
    console.log("sending random int:", randomInt);
    call.write({ numb: randomInt });
  }, 500);
  setTimeout(() => {
    clearInterval(stopID);
    call.end();
  }, 1000 * 30);
}

/**
 *
 * Bi-directional Streaming
 *
 */

function ItemStreamer(call: grpc.ServerDuplexStream<any, any>) {
  console.log("stream open");
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
