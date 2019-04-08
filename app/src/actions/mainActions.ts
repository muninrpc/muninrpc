import { action } from "typesafe-actions";
import { Mode } from "../models";
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

  export const handleIPInput = (value: string) => action(Type.HANDLE_IP_INPUT, value);
  export const handleConfigInput = value => action(Type.HANDLE_CONFIG_INPUT, value);
  export const handleProtoUpload = (filelist: FileList) => action(Type.HANDLE_PROTO_UPLOAD, filelist);
  export const handleServiceClick = (service: { service: string }) => action(Type.HANDLE_SERVICE_CLICK, service);
  export const setGRPCResponse = (response: object) => action(Type.SET_GRPC_RESPONSE, response);
  export const handleRequestClick = (request: { service: string; request: string }) =>
    action(Type.HANDLE_REQUEST_CLICK, request);

  export const handleRepeatedClick = (newMemberInfo: { id: string; action: string }) =>
    action(Type.HANDLE_REPEATED_CLICK, newMemberInfo);

  //new
  export const handleSendRequest = () => (dispatch, getState) => {
    const state = getState().main;
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

      handler.initiateRequest().then(response => {
        dispatch(setGRPCResponse(response));
      });
    }
  };

  export const setMode = (value: Mode) => action(Type.HANDLE_SET_MODE, value);

  export const handleServiceTrie = (value: string) => action(Type.HANDLE_SERVICE_TRIE, value);

  export const handleMessageTrie = (value: string) => action(Type.HANDLE_MESSAGE_TRIE, value);
}

export type mainActions = Omit<typeof mainActions, "Type">;
