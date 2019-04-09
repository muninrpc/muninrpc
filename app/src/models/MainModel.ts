import * as protoLoader from "@grpc/proto-loader";
import { CallType, BaseConfig, RequestConfig } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export interface MainModel {
  initialState: any,
  selectedTab: string,
  leftArray: JSX.Element[],
  tabPrimaryKey: number,
  handlers: any[], // TODO: Find correct handler type
}
