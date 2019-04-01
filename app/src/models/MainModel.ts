import { ReactComponentElement } from "react";
import { ServerResponse } from "http";

export interface MainModel {
  responseDisplay: string,
  responseMetrics: string,
  targetIP: string,
  filePath: string,
  trail: string,
  connectType: string,
  mode: MainModel.Mode,
  serviceList: string[],
  requestList: string[],
  serverResponse: string[],
  selectedService: string,
  selectedRequest: string
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = 'service_and_request',
    SHOW_MESSAGES = 'messages',
    SHOW_SETUP = 'setup'
  }
}
