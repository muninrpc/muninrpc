import * as protoLoader from "@grpc/proto-loader";
import { CallType, BaseConfig, RequestConfig } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export interface MainModel {
  selectedTab: number,
  leftArray: JSX.Element[],
  cleanLeft: JSX.Element
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = "SERVICE_AND_REQUEST",
    SHOW_MESSAGES = "MESSAGES",
    SHOW_SETUP = "SETUP",
  }
}
