import { createAction } from 'redux-actions';
import { MainModel } from '../models/MainModel';

export namespace mainActions {
  export enum Type {
    HANDLE_IP_INPUT = 'HANDLE_IP_INPUT',
    HANDLE_PROTO_UPLOAD = 'HANDLE_PROTO_UPLOAD',
    HANDLE_SEND_REQUEST = 'HANDLE_SEND_REQUEST'
  }

  export const handleIPInput = createAction<PartialPick<MainModel, 'targetIP'>>(Type.HANDLE_IP_INPUT);
  export const handleProtoUpload = createAction<PartialPick<MainModel, 'filePath'>>(Type.HANDLE_PROTO_UPLOAD);
  export const sendRequest = createAction<any>(Type.HANDLE_SEND_REQUEST); //replace <any> with the function shape
}

export type mainActions = Omit<typeof mainActions, 'Type'>;


/*

targetIP - string
filePath - string
trail - string
connectionDisplay - string
responseDisplay - string
repsonseMetrics - string

handleIPInput - func
handleProtoUpload - func
sendRequest - func

*/


