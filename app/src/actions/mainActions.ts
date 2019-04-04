import { createAction } from "redux-actions";
import { MainModel } from "../models/MainModel";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";

export namespace mainActions {
  export enum Type {
    HANDLE_IP_INPUT = "HANDLE_IP_INPUT",
    HANDLE_PROTO_UPLOAD = "HANDLE_PROTO_UPLOAD",
    HANDLE_SEND_REQUEST = "HANDLE_SEND_REQUEST",
    HANDLE_SET_MODE = "HANDLE_SET_MODE",
    HANDLE_SERVICE_CLICK = "HANDLE_SERVICE_CLICK",
    HANDLE_REQUEST_CLICK = "HANDLE_REQUEST_CLICK",
    HANDLE_SERVICE_TRIE = "HANDLE_SERVICE_TRIE",
    HANDLE_MESSAGE_TRIE = "HANDLE_MESSAGE_TRIE",
    HANDLE_CONFIG_INPUT = "HANDLE_CONFIG_INPUT",
    HANDLE_REPEATED_CLICK = "HANDLE_REPEATED_CLICK",
    SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
  }

  export const handleIPInput = value => ({
    type: Type.HANDLE_IP_INPUT,
    payload: value,
  });
  export const handleConfigInput = value => ({
    type: Type.HANDLE_CONFIG_INPUT,
    payload: value,
  });
  export const handleProtoUpload = filelist => ({
    type: Type.HANDLE_PROTO_UPLOAD,
    payload: filelist,
  });
  export const handleServiceClick = service => ({
    type: Type.HANDLE_SERVICE_CLICK,
    payload: service,
  });
  export const handleRequestClick = request => ({
    type: Type.HANDLE_REQUEST_CLICK,
    payload: request,
  });

  export const handleRepeatedClick = createAction<PartialPick<MainModel, "configElements">>(
    Type.HANDLE_REPEATED_CLICK,
  );

  //old
  // export const handleSendRequest = () => ({
  //   type: Type.HANDLE_SEND_REQUEST,
  // });
  
  //new
  export const handleSendRequest =  () => (dispatch, getState) => {
    console.log('get state',getState())
    const state = getState().main
    if (state.requestConfig.callType === CallType.UNARY_CALL) {
      const requestConfig: RequestConfig<UnaryRequestBody> = {
        ...state.requestConfig,
        reqBody: { argument: state.configArguments.arguments },
      };
      const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
        ...state.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      
      handler.initiateRequest()
      .then((response) => {
        console.log('inside initiateResponse',response)
        dispatch(setGRPCResponse(response))
      })
    }
  }

  export const setGRPCResponse = response => {
    return {
    type: Type.SET_GRPC_RESPONSE,
    payload: response,
  }};

  export const setMode = value => ({
    type: Type.HANDLE_SET_MODE,
    payload: value,
  });

  export const handleServiceTrie = value => ({
    type: Type.HANDLE_SERVICE_TRIE,
    payload: value,
  });
  export const handleMessageTrie = value => ({
    type: Type.HANDLE_MESSAGE_TRIE,
    payload: value,
  });
}

export type mainActions = Omit<typeof mainActions, "Type">;
