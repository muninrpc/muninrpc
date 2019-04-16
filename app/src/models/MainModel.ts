import * as grpc from "grpc";

export interface MainModel {
  handlers: { [name: string]: grpc.ClientWritableStream<any> }; // TODO: Find correct handler type
  selectedTab: string;
  leftArray: JSX.Element[];
  tabPrimaryKey: number;
  handlerInfo: {
    [name: string]: {
      isStreaming: boolean;
      serverResponse: { type: string; payload: {} }[];
      responseMetrics: { timeStamp: string; request: string };
    };
  };
  activeTab: any;
  tabInfo: {
    [key: string]: {
      name: string;
      activeResponseTab: string;
    };
  };
}
