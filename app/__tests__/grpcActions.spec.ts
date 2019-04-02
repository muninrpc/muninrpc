import {
  RequestConfig,
  CallType,
  BaseConfig,
  StreamAction,
  UnaryRequestBody,
  ClientStreamRequestBody
} from "../lib/local/grpcHandlerFactory";

import { getServer } from "./grpc-server/grpc-server";
import * as protoLoader from "@grpc/proto-loader";
import * as path from "path";
import { GrpcHandlerFactory } from "../lib/local/grpcHandlerFactory";
import * as grpc from "grpc";
import * as _ from "lodash";

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

  const packageDefinition = protoLoader.loadSync(
    path.resolve(__dirname, "./grpc-server/protos/todo.proto")
  );

  const baseConfig: BaseConfig = {
    grpcServerURI: "localhost:50052",
    packageDefinition: packageDefinition,
    packageName: "todo",
    serviceName: "ListActions"
  };

  console.log("packageDefinition", packageDefinition);

  it("should make a unary call with no arguments", async () => {
    const expected = {
      items: [{ item: "clean the house" }, { item: "do laundry" }]
    };

    const unaryCallConfig: RequestConfig<UnaryRequestBody> = {
      requestName: "GetList",
      callType: CallType.UNARY_CALL,
      reqBody: { argument: {} }
    };

    const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
      ...baseConfig,
      ...unaryCallConfig
    };

    const unaryHandler = GrpcHandlerFactory.createHandler(mergedConfig);

    // await expect(unaryHandler.initiateRequest()).resolves.toEqual(expected);
  });

  it("should make a unary call with arguments", async () => {
    const expected = {
      items: [{ item: "clean the house" }, { item: "do laundry" }, { item: "more to do" }]
    };

    const unaryCallConfig: RequestConfig<UnaryRequestBody> = {
      callType: CallType.UNARY_CALL,
      requestName: "AddItem",
      reqBody: { argument: { item: "more to do" } }
    };

    const mergedConfig = { ...baseConfig, ...unaryCallConfig };

    const unaryHandler = GrpcHandlerFactory.createHandler(mergedConfig);

    await expect(unaryHandler.initiateRequest()).resolves.toEqual(expected);
  });

  it("should make a client side streaming request to calculate average", done => {
    const clientStreamConfig: RequestConfig<ClientStreamRequestBody> = {
      callType: CallType.CLIENT_STREAM,
      requestName: "CalculateAverage",
      reqBody: {
        action: StreamAction.INITIATE,
        callback: data => {
          expect(data).toEqual({ average: 15 });
          done();
        }
      }
    };

    const mergedConfig = { ...baseConfig, ...clientStreamConfig };

    const clientStreamHandler = GrpcHandlerFactory.createHandler(mergedConfig);
    const { writableStream } = clientStreamHandler.returnHandler();

    writableStream.write({ numb: 10 });
    writableStream.write({ numb: 15 });
    writableStream.write({ numb: 20 });
    writableStream.end();
  });
});
