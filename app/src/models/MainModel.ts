import { ReactComponentElement } from "react";
import { ServerResponse } from "http";
import * as protoLoader from "@grpc/proto-loader";
import { CallType } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

export interface MainModel {
  responseMetrics: string;
  targetIP: string;
  filePath: string;
  trail: string;
  connectType: CallType | string;
  mode: MainModel.Mode;
  serviceList: string[];
  messageList: any;
  serverResponse: string[];
  packageDefinition: protoLoader.PackageDefinition;
  selectedService: string;
  selectedRequest: string;

  serviceTrie: Trie;
  serviceTrieInput: string;
  serviceRecommendations: string[];

  requestTrie: Trie;

  messageTrie: Trie;
  messageRecommendations: string[];
  messageTrieInput: string;
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = "SERVICE_AND_REQUEST",
    SHOW_MESSAGES = "MESSAGES",
    SHOW_SETUP = "SETUP",
  }
}
