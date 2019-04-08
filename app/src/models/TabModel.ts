import * as protoLoader from "@grpc/proto-loader";
import { BaseConfig, RequestConfig } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export type TabState = {
  readonly baseConfig: BaseConfig;
  readonly configArguments: { arguments: {} };
  readonly configElements: { arguments: {} };
  readonly filePath: string;
  readonly messageList: { [index: string]: protoLoader.MessageTypeDefinition };
  readonly messageTrie: Trie;
  readonly messageTrieInput: string;
  readonly messageRecommendations: string[];
  readonly mode: Mode;
  readonly requestConfig: RequestConfig<any>;
  readonly requestTrie: Trie;
  readonly responseMetrics: string;
  readonly serviceList: { [index: string]: protoLoader.ServiceDefinition };
  readonly serviceRecommendations: string[];
  readonly serverResponse: object;
  readonly selectedRequest: string;
  readonly selectedService: string;
  readonly serviceTrie: Trie;
  readonly serviceTrieInput: string;
};

export enum Mode {
  SHOW_SERVICE = "SERVICE_AND_REQUEST",
  SHOW_MESSAGES = "MESSAGES",
  SHOW_SETUP = "SETUP",
}
