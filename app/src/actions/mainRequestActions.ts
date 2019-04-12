import { action } from "typesafe-actions";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  ClientStreamRequestBody,
  ServerStreamRequestBody,
  BidiStreamRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";
import { cloneDeep } from "@babel/types";

export namespace mainRequestActions {

  export enum Type {
    HANDLE_UNARY_REQUEST = "HANDLE_UNARY_REQUEST",
    HANDLE_CLIENT_STREAM_START = "HANDLE_CLIENT_STREAM_START",
    SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
  }

  export const setGRPCResponse = (response: object) => action(Type.SET_GRPC_RESPONSE, response)

  export const handleUnaryRequest = () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main

    if (activeTab.requestConfig.callType === CallType.UNARY_CALL) {
      const requestConfig: RequestConfig<UnaryRequestBody> = {
        ...activeTab.requestConfig,
        argument: activeTab.configArguments.arguments,
      };
      const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      state.handlers[state.selectedTab] = handler;
      
      handler.initiateRequest().then(response => {
        dispatch(setGRPCResponse(response));
      });
    }
  };

  export const handleClientStreamStart = () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main
    
    if (activeTab.requestConfig.callType === CallType.CLIENT_STREAM) {
      const requestConfig: RequestConfig<ClientStreamRequestBody> = {
        ...activeTab.requestConfig,
        streamConfig: { onEndCb: (res) => dispatch(setGRPCResponse(res) ) },
        argument: {},
      };
      const mergedConfig: BaseConfig & RequestConfig<ClientStreamRequestBody> = {
        ...activeTab.baseConfig,
        ...requestConfig
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      handler.initiateRequest();
      let now = new Date();
      state.handlerInfo[state.selectedTab].responseMetrics =  `Stream started at: ${now.toLocaleTimeString()}`;
      //console.log('Starting stream!')
      const { writableStream } =  handler.returnHandler();
      //console.log('writable stream:', writableStream)
      state.handlers[state.selectedTab] = writableStream;
    }
  };
  

}

export type mainRequestActions = Omit<typeof mainRequestActions, "Type">;