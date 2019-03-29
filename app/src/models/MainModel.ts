import { ReactComponentElement } from "react";

export interface MainModel {
  responseDisplay: string,
  responseMetrics: string,
  targetIP: string,
  filePath: string,
  trail: string,
  connectType: string,
  mode: MainModel.Mode,
  serviceList: string[],
  requestList: string[] 
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = 'service',
    SHOW_REQUEST = 'request',
    SHOW_SETUP = 'setup'
  }
}
