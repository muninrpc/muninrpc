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
    REMOVE_TAB = "REMOVE_TAB",
    SELECT_TAB = "SELECT_TAB",
  }

  export const addNewTab = (funcs) => ({
    type: Type.ADD_NEW_TAB,
    payload: { tabFuncs: funcs }
  })

  export const removeTab = (id) => ({
    type: Type.REMOVE_TAB,
    payload: id
  })

  export const selectTab = (id) => ({
    type: Type.SELECT_TAB,
    payload: id
  })

}

export type mainActions = Omit<typeof mainActions, "Type">;