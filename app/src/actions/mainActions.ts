import { action } from "typesafe-actions";
import { MainModel } from "../models";

export namespace mainActions {
  export enum Type {
    ADD_NEW_TAB = "ADD_NEW_TAB",
    REMOVE_TAB = "REMOVE_TAB",
    SELECT_TAB = "SELECT_TAB",
    SELECT_RESPONSE_TAB = "SELECT_RESPONSE_TAB",
    GET_TAB_STATE = "GET_TAB_STATE",
    SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
    TOGGLE_STREAM = "TOGGLE_STREAM",
    UPDATE_TAB_NAMES = "UPDATE_TAB_NAMES",
  }

  export const getTabState = state => action(Type.GET_TAB_STATE, state);

  export const addNewTab = (reducerFunc: {
    [funcName: string]: {
      getTabState: mainActions["getTabState"];
      updateTabNames: mainActions["updateTabNames"];
    };
  }) => action(Type.ADD_NEW_TAB, reducerFunc);

  export const removeTab = (id: string) => action(Type.REMOVE_TAB, id);

  export const selectTab = (id: string) => action(Type.SELECT_TAB, id);

  export const toggleStream = (boolean: boolean) => action(Type.TOGGLE_STREAM, boolean);

  export const updateTabNames = (obj: { [key: string]: string }) => action(Type.UPDATE_TAB_NAMES, obj);

  export const selectResponseTab = (obj: { [key: string]: MainModel["selectedTab"]; val: string }) =>
    action(Type.SELECT_RESPONSE_TAB, obj);
}

export type mainActions = Omit<typeof mainActions, "Type">;
