import {
  RequestConfig,
  CallType,
  BaseConfig,
  ClientStreamCbs,
  BidiAndServerStreamCbs,
} from "../lib/local/grpcHandlerFactory";

import { getServer } from "./grpc-server/grpc-server";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import { GrpcHandlerFactory } from "../lib/local/grpcHandlerFactory";
import * as grpc from "grpc";
import * as _ from "lodash";

// class Observer implements Observers {
//   private onUpdateCb: Function;
//   private onEndCb: Function;
//   constructor(onUpdateCb: Function, onEndCb: Function) {
//     this.onUpdateCb = onUpdateCb;
//     this.onEndCb = onEndCb;
//   }
//   update(o: object[]) {
//     this.onUpdateCb(o);
//   }

//   finalUpdate(o: object[]) {
//     this.onEndCb(o);
//   }
// }

describe("test gRPC unary call", () => {
  let routeServer: grpc.Server;

  beforeAll(() => {
    routeServer = getServer();
    routeServer.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
    routeServer.start();
    console.log("Starting gRPC server");
  });

  afterAll(() => {
    routeServer.tryShutdown(() => {});
  });

  const packageDefinition = protoLoader.loadSync(path.resolve(__dirname, "./grpc-server/protos/todo.proto"));

  const baseConfig: BaseConfig = {
    grpcServerURI: "localhost:50052",
    packageDefinition: packageDefinition,
    packageName: "todo",
    serviceName: "ListActions",
  };

  it("should make a unary call with no arguments", done => {
    const expected = {
      items: [{ item: "clean the house" }, { item: "do laundry" }],
    };

    const unaryCallConfig: RequestConfig<void> = {
      requestName: "GetList",
      callType: CallType.UNARY_CALL,
      argument: {},
      callbacks: null,
    };

    const mergedConfig = { ...baseConfig, ...unaryCallConfig };

    const unaryHandler = GrpcHandlerFactory.createHandler(mergedConfig);

    // await expect(unaryHandler.initiateRequest()).resolves.toEqual(expected);
    unaryHandler.initiateRequest().then(res => {
      //@ts-ignore
      expect(res[0].payload).toEqual(expected);
      done();
    });
  });

  it("should make a unary call with arguments", done => {
    const expected = {
      items: [{ item: "clean the house" }, { item: "do laundry" }, { item: "more to do" }],
    };

    const unaryCallConfig: RequestConfig<void> = {
      callType: CallType.UNARY_CALL,
      requestName: "AddItem",
      argument: { item: "more to do" },
      callbacks: null,
    };

    const mergedConfig = { ...baseConfig, ...unaryCallConfig };

    const unaryHandler = GrpcHandlerFactory.createHandler(mergedConfig);

    // await expect(unaryHandler.initiateRequest()[0].payload).resolves.toEqual(expected);
    unaryHandler.initiateRequest().then(res => {
      //@ts-ignore
      expect(res[0].payload).toEqual(expected);
      done();
    });
  });

  it("should make a client side streaming request to calculate average", done => {
    const clientStreamConfig: RequestConfig<ClientStreamCbs> = {
      callType: CallType.CLIENT_STREAM,
      requestName: "CalculateAverage",
      argument: {},
      callbacks: {
        onEndReadCb: function(data) {
          const result = data.average.low;
          expect(result).toEqual(15);
          done();
        },
      },
    };

    const mergedConfig: BaseConfig & RequestConfig<ClientStreamCbs> = { ...baseConfig, ...clientStreamConfig };

    const clientStreamHandler = GrpcHandlerFactory.createHandler(mergedConfig);
    //@ts-ignore
    clientStreamHandler.initiateRequest();
    const { writableStream } = clientStreamHandler.getEmitters();

    writableStream.write({ numb: 10 });
    writableStream.write({ numb: 15 });
    writableStream.write({ numb: 20 });
    writableStream.end();
  });

  it("should respond to a server side streaming request", done => {
    const testArr = [];
    const onDataReadCb = (data: object[]) => {
      testArr.push(data[data.length - 1]);
      // console.log("from observer", testArr[testArr.length - 1]);
    };
    const onEndReadCb = () => {
      const extracted = [];
      Object.values(testArr).forEach(obj => {
        extracted.push(obj.payload);
      });
      expect(extracted).toEqual([{ numb: 3 }, { numb: 3 }, { numb: 3 }, { numb: 3 }, { numb: 3 }]);
      done();
    };

    const serverStreamConfig: RequestConfig<BidiAndServerStreamCbs> = {
      callType: CallType.SERVER_STREAM,
      requestName: "TestServerStream",
      argument: {},
      callbacks: {
        onDataReadCb,
        onEndReadCb,
      },
    };

    // const testObserver = new Observer(onDataCb, onEndCb);

    const mergedConfig: BaseConfig & RequestConfig<BidiAndServerStreamCbs> = {
      ...baseConfig,
      ...serverStreamConfig,
    };

    const serverStreamHandler = GrpcHandlerFactory.createHandler(mergedConfig);
    // serverStreamHandler.registerObservers(testObserver);
    serverStreamHandler.initiateRequest();
  });

  it("should test bidirectional streaming", done => {
    const testArr = [];
    const bidiStreamConfig: RequestConfig<BidiAndServerStreamCbs> = {
      callType: CallType.BIDI_STREAM,
      requestName: "ItemStreamer",
      argument: {},
      callbacks: {
        onDataReadCb: data => {
          data.forEach(entry => {
            if (entry.type === "read") {
              testArr.push(entry.payload);
            }
          });
        },

        onEndReadCb: () => {
          expect(testArr).toEqual([
            { msg: "spoon - count: 0" },
            { msg: "fork - count: 1" },
            { msg: "spoon - count: 0" },
          ]);
          done();
        },
      },
    };

    const mergedConfig: BaseConfig & RequestConfig<BidiAndServerStreamCbs> = {
      ...baseConfig,
      ...bidiStreamConfig,
    };
    // @ts-ignore
    const bidiStreamHandler = GrpcHandlerFactory.createHandler(mergedConfig) as BidiStreamHandler;
    bidiStreamHandler.initiateRequest();
    const { writableStream } = bidiStreamHandler.getEmitters();

    const messagesToSend = [{ item: "spoon" }, { item: "fork" }];
    messagesToSend.forEach(msg => {
      writableStream.write(msg);
    });
    writableStream.end();
  });
});
