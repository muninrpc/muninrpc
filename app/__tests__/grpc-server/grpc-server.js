"use strict";
exports.__esModule = true;
var path = require("path");
var PROTO_PATH = path.resolve(__dirname, "./protos/todo.proto");
var grpc = require("grpc");
var async = require("async");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
var todo_proto = grpc.loadPackageDefinition(packageDefinition).todo;
var toDoList = [{ item: "clean the house" }, { item: "do laundry" }];
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
function CalculateAverage(call, callback) {
    var numCache = [];
    call.on("data", function (data) {
        numCache.push(data.numb);
    });
    call.on("end", function () {
        var average = numCache.reduce(function (acc, curr) { return acc + curr; }) / numCache.length;
        callback(null, { average: average });
    });
}
/**
 *
 *  Server side streaming
 *
 */
function TestServerStream(call) {
    let stopID = setInterval( () => {
        let randomInt = Math.floor(Math.random() * 100)
        console.log('sending random int:',randomInt)
        call.write({numb: randomInt})
    }
    , 500)
    setTimeout( () => {
        clearInterval(stopID);
        call.end();
    }, 1000 * 30)
}
/**
 *
 * Bi-directional Streaming
 *
 */
function ItemStreamer(call) {
    console.log("stream open");
    var counter = 0;
    call.on("data", function (msg) {
        call.write({ msg: msg.item + " - count: " + counter++ });
    });
    call.on("end", function () {
        call.end();
    });
}
function getServer() {
    var server = new grpc.Server();
    server.addService(todo_proto.ListActions.service, {
        GetList: GetList,
        AddItem: AddItem,
        ItemStreamer: ItemStreamer,
        CalculateAverage: CalculateAverage,
        TestServerStream: TestServerStream
    });
    return server;
}
exports.getServer = getServer;
if (require.main === module) {
    var routeServer = getServer();
    routeServer.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
    routeServer.start();
}
