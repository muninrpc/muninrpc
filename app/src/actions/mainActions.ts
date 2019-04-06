import { MainModel } from "../models/MainModel";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";

export namespace mainActions {
  export enum Type {
    ADD_NEW_TAB = "ADD_NEW_TAB",
    REMOVE_TAB = "REMOVE_TAB"
  }

  export const addNewTab = (func) => ({
    type: Type.ADD_NEW_TAB,
    payload: { removeFunc: func }
  })

  export const removeTab = (id) => {
    return {
    type: Type.REMOVE_TAB,
    payload: id
    }
  }
}

export type mainActions = Omit<typeof mainActions, "Type">;