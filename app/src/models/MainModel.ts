import { ReactComponentElement } from "react";
import { ServerResponse } from "http";
import * as protoLoader from "@grpc/proto-loader";

export interface MainModel {
  responseMetrics: string;
  targetIP: string;
  filePath: string;
  trail: string;
  connectType: string;
  mode: MainModel.Mode;
  serviceList: string[];
  messageList: any;
  serverResponse: string[];
  packageDefinition: protoLoader.PackageDefinition;
  selectedService: string;
  selectedRequest: string;
  configArguments: any;
  configElements: any;
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = "SERVICE_AND_REQUEST",
    SHOW_MESSAGES = "MESSAGES",
    SHOW_SETUP = "SETUP"
  }
}
