import * as protoLoader from "@grpc/proto-loader";
import { CallType, BaseConfig, RequestConfig } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export interface MainModel {
  baseConfig: BaseConfig;
  configArguments: { arguments: {} };
  configElements: { arguments: {} };
  filePath: string;
  messageList: { [index: string]: protoLoader.MessageTypeDefinition };
  messageTrie: Trie;
  messageTrieInput: string;
  messageRecommendations: string[];
  mode: MainModel.Mode;
  requestConfig: RequestConfig<any>;
  requestTrie: Trie;
  responseMetrics: string;
  serviceList: { [index: string]: protoLoader.ServiceDefinition };
  serviceRecommendations: string[];
  serverResponse: object;
  selectedRequest: string;
  selectedService: string;
  serviceTrie: Trie;
  serviceTrieInput: string;
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
