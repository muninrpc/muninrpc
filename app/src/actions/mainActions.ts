import { createAction } from "redux-actions";
import { MainModel } from "../models/MainModel";

export namespace mainActions {
  export enum Type {
    HANDLE_IP_INPUT = "HANDLE_IP_INPUT",
    HANDLE_PROTO_UPLOAD = "HANDLE_PROTO_UPLOAD",
    HANDLE_SEND_REQUEST = "HANDLE_SEND_REQUEST",
    HANDLE_SET_MODE = "HANDLE_SET_MODE",
    HANDLE_SERVICE_CLICK = "HANDLE_SERVICE_CLICK",
    HANDLE_REQUEST_CLICK = "HANDLE_REQUEST_CLICK",
    HANDLE_SERVICE_TRIE = "HANDLE_SERVICE_TRIE",
    HANDLE_MESSAGE_TRIE = "HANDLE_MESSAGE_TRIE",
  }

  export const handleIPInput = createAction<PartialPick<MainModel, "targetIP">>(
    Type.HANDLE_IP_INPUT,
  );
  export const handleProtoUpload = createAction<PartialPick<MainModel, "filePath">>(
    Type.HANDLE_PROTO_UPLOAD,
  );
  export const handleServiceClick = createAction<PartialPick<MainModel, "selectedService">>(
    Type.HANDLE_SERVICE_CLICK,
  );
  export const handleRequestClick = createAction<PartialPick<MainModel, "selectedRequest">>(
    Type.HANDLE_REQUEST_CLICK,
  );
  export const sendRequest = createAction<any>(Type.HANDLE_SEND_REQUEST); //replace <any> with the function shape
  export const setMode = createAction<string>(Type.HANDLE_SET_MODE);
  export const handleServiceTrie = createAction<PartialPick<MainModel, "serviceTrieInput">>(
    Type.HANDLE_SERVICE_TRIE,
  );
  export const handleMessageTrie = createAction<PartialPick<MainModel, "messageTrieInput">>(
    Type.HANDLE_MESSAGE_TRIE,
  );
}

export type mainActions = Omit<typeof mainActions, "Type">;

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
