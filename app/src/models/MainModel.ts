import * as protoLoader from "@grpc/proto-loader";
import { CallType, BaseConfig, RequestConfig } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export interface MainModel {
  baseConfig: BaseConfig;
  configArguments: { arguments: {} };
  configElements: { arguments: {} };
  filePath: string;
  messageList: any;
  messageTrie: Trie;
  messageTrieInput: string;
  messageRecommendations: string[];
  mode: MainModel.Mode;
  requestConfig: RequestConfig<any>;
  requestTrie: Trie;
  responseMetrics: string;
  serverResponse: string[];
  serviceList: string[];
  serviceRecommendations: string[];
  selectedRequest: string;
  selectedService: string;
  serviceTrie: Trie;
  serviceTrieInput: string;
  trail: string;
  // targetIP: string;
  // connectType: CallType | string;
  // packageDefinition: protoLoader.PackageDefinition;
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = "SERVICE_AND_REQUEST",
    SHOW_MESSAGES = "MESSAGES",
    SHOW_SETUP = "SETUP",
  }
}
