import { action } from "typesafe-actions";
import { Mode } from "../models";
import { MainModel } from "../models/MainModel";

export namespace mainActions {
  export enum Type {
    ADD_NEW_TAB = "ADD_NEW_TAB",
    REMOVE_TAB = "REMOVE_TAB",
    SELECT_TAB = "SELECT_TAB",
    GET_TAB_STATE = "GET_TAB_STATE",
  }

  export const getTabState = state => action(Type.GET_TAB_STATE, state);

  export const addNewTab = reducerFunc => action(Type.ADD_NEW_TAB, reducerFunc);

  export const removeTab = id => action(Type.REMOVE_TAB, id);

  export const selectTab = id => action(Type.SELECT_TAB, id);
}

export type mainActions = Omit<typeof mainActions, "Type">;
