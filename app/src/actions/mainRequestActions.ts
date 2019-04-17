import { action } from "typesafe-actions";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  ClientStreamCbs,
  BidiAndServerStreamCbs,
  ServerStreamHandler,
  BidiStreamHandler,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";

export enum mainRequestActionType {
  HANDLE_UNARY_REQUEST = "HANDLE_UNARY_REQUEST",
  HANDLE_CLIENT_STREAM_START = "HANDLE_CLIENT_STREAM_START",
  HANDLE_SERVER_STREAM_START = "HANDLE_SERVER_STREAM_START",
  HANDLE_BIDI_STREAM_START = "HANDLE_BIDI_STREAM_START",
  SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
  HANDLE_SEND_MESSAGE = "HANDLE_SEND_MESSAGE",
  HANDLE_STOP_STREAM = "HANDLE_STOP_STREAM",
  HANDLE_RECIEVE_MESSAGE = "HANDLE_RECIEVE_MESSAGE",
}
export const mainRequestActions = {
  handleSendMessage: () => action(mainRequestActionType.HANDLE_SEND_MESSAGE),
  handleRecieveMessage: () => action(mainRequestActionType.HANDLE_RECIEVE_MESSAGE),
  handleStopStream: (type?: string) => action(mainRequestActionType.HANDLE_STOP_STREAM, type),
  setGRPCResponse: (res: {response: object, tabKey: string}) => action(mainRequestActionType.SET_GRPC_RESPONSE, res),
  handleUnaryRequest: () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main;
    const selectedTab = state.selectedTab;

    if (activeTab.requestConfig.callType === CallType.UNARY_CALL) {
      const requestConfig: RequestConfig<void> = {
        ...activeTab.requestConfig,
        argument: activeTab.configArguments.arguments,
        
      };
      const mergedConfig: BaseConfig & RequestConfig<void> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      state.handlers[state.selectedTab] = handler;
      state.handlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `Request ${activeTab.selectedRequest} sent to ${activeTab.baseConfig.grpcServerURI}`,
      };
      // `${activeTab.selectedRequest} called: [${(new Date()).toLocaleTimeString("en-US", {hour12: false} )}]`;
      handler
        .initiateRequest()
        .then(response => {
          dispatch(mainRequestActions.setGRPCResponse({response: response, tabKey: selectedTab}) );
        })
        .catch(error => {
          dispatch(mainRequestActions.setGRPCResponse({response: error, tabKey: selectedTab}));
        });
    }
  },

  handleClientStreamStart: () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main;
    const selectedTab = state.selectedTab;

    if (activeTab.requestConfig.callType === CallType.CLIENT_STREAM) {
      const requestConfig: RequestConfig<ClientStreamCbs> = {
        ...activeTab.requestConfig,
        callbacks: {
          onEndReadCb: res => {
            dispatch(
              mainRequestActions.setGRPCResponse({
                response: [{ 
                  type: "read", 
                  payload: res 
                  },
                  ...getState().main.handlerInfo[state.selectedTab].serverResponse,
                ], 
                tabKey: selectedTab
              }),
            );
          },
          onDataWriteCb: response =>
            setTimeout(() => {
              dispatch(mainRequestActions.setGRPCResponse({response: response, tabKey: selectedTab}));
            }, 1),
        },
        argument: {},
      };
      const mergedConfig: BaseConfig & RequestConfig<ClientStreamCbs> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig);
      handler.initiateRequest();
      state.handlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `${activeTab.selectedRequest} started on ${activeTab.baseConfig.grpcServerURI}`,
      };
      const { writableStream } = handler.getEmitters();
      state.handlers[state.selectedTab] = writableStream;
    }
  },

  handleServerStreamStart: () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main;
    const selectedTab = state.selectedTab;

    if (activeTab.requestConfig.callType === CallType.SERVER_STREAM) {
      const requestConfig: RequestConfig<BidiAndServerStreamCbs> = {
        ...activeTab.requestConfig,
        callbacks: {
          onDataReadCb: response => {
            dispatch(mainRequestActions.setGRPCResponse({response: response, tabKey: selectedTab}));
            dispatch(mainRequestActions.handleRecieveMessage());
          },
          onEndReadCb: response => {
            dispatch(mainRequestActions.handleStopStream("server_end"));
          },
        },
        argument: {},
      };
      const mergedConfig: BaseConfig & RequestConfig<BidiAndServerStreamCbs> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig) as ServerStreamHandler;
      handler.initiateRequest();
      const { readableStream } = handler.getEmitters();
      state.handlers[state.selectedTab] = readableStream;

      state.handlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `${activeTab.selectedRequest} started on ${activeTab.baseConfig.grpcServerURI}`,
      };
    }
  },

  handleBidiStreamStart: () => (dispatch, getState) => {
    const activeTab = getState().main.activeTab;
    const state = getState().main;
    const selectedTab = state.selectedTab;

    if (activeTab.requestConfig.callType === CallType.BIDI_STREAM) {
      const requestConfig: RequestConfig<BidiAndServerStreamCbs> = {
        ...activeTab.requestConfig,
        callbacks: {
          onDataReadCb: response => dispatch(mainRequestActions.setGRPCResponse({response: response, tabKey: selectedTab})),
          onEndReadCb: () => {
            dispatch(mainRequestActions.handleStopStream());
          },
        },
        argument: {},
      };
      const mergedConfig: BaseConfig & RequestConfig<BidiAndServerStreamCbs> = {
        ...activeTab.baseConfig,
        ...requestConfig,
      };
      const handler = GrpcHandlerFactory.createHandler(mergedConfig) as BidiStreamHandler;
      handler.initiateRequest();
      state.handlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `${activeTab.selectedRequest} started on ${activeTab.baseConfig.grpcServerURI}`,
      };
      const { writableStream } = handler.getEmitters();
      state.handlers[state.selectedTab] = writableStream;
    }
  },
};
// export type mainRequestActions = typeof mainRequestActions;
