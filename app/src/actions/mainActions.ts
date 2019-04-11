import { action } from "typesafe-actions";
import { Mode } from "../models";
import { MainModel } from "../models/MainModel";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  ClientStreamRequestBody,
  ServerStreamRequestBody,
  BidiStreamRequestBody,
  GrpcHandlerFactory,
  StreamAction
} from "../../lib/local/grpcHandlerFactory";
import { cloneDeep } from "@babel/types";

export namespace mainActions {
  export enum Type {
    ADD_NEW_TAB = "ADD_NEW_TAB",
    REMOVE_TAB = "REMOVE_TAB",
    SELECT_TAB = "SELECT_TAB",
    GET_TAB_STATE = "GET_TAB_STATE",

    //HANDLE_SEND_REQUEST = "HANDLE_SEND_REQUEST",
    SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
    TOGGLE_STREAM = "TOGGLE_STREAM"
  }
}

  export const getTabState = state => action(Type.GET_TAB_STATE, state);

  export const addNewTab = reducerFunc => action(Type.ADD_NEW_TAB, reducerFunc);

  export const removeTab = id => action(Type.REMOVE_TAB, id);

  export const selectTab = id => action(Type.SELECT_TAB, id);
  
  export const setGRPCResponse = (response: object) => ({
    type: Type.SET_GRPC_RESPONSE,
    payload: response
  })

  //new
  export const handleSendRequest = () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main

    //Unary
    if (activeTab.requestConfig.callType === CallType.UNARY_CALL) {
      const requestConfig: RequestConfig<UnaryRequestBody> = {
        ...activeTab.requestConfig,
        reqBody: { argument: activeTab.configArguments.arguments },
      };
      const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      state.handlers[state.selectedTab] = handler;
      // const newHandlers = cloneDeep(state.handlers)
      

      handler.initiateRequest().then(response => {
        dispatch(setGRPCResponse(response));
      });
    }

    //Client Stream
    if (activeTab.requestConfig.callType === CallType.CLIENT_STREAM) {
      const requestConfig: RequestConfig<ClientStreamRequestBody> = {
        ...activeTab.requestConfig,
        reqBody: {
          action: StreamAction.INITIATE
          //maybe callback?
        }
      };
      const mergedConfig: BaseConfig & RequestConfig<ClientStreamRequestBody> = {
        ...activeTab.baseConfig,
        ...requestConfig
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      
      state.handlers[state.selectedTab] = handler;
      
    }
  };

  export const toggleStream = (boolean) => ({
    type: Type.TOGGLE_STREAM,
    payload: boolean
  })

}

export type mainActions = Omit<typeof mainActions, "Type">;
