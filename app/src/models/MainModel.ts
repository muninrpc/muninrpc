export interface MainModel {
  responseDisplay: string,
  responseMetrics: string,
  targetIP: string,
  filePath: string,
  trail: string,
  connectType: string 
}

export namespace MainModel {
  export enum Mode {
    SHOW_SERVICE = 'service',
    SHOW_REQUEST = 'request',
    SHOW_SETUP = 'setup'
  }
}
