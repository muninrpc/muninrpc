import { action } from "typesafe-actions";
import { MainModel } from "../models";

export enum mainActionType {
  ADD_NEW_TAB = "ADD_NEW_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  SELECT_TAB = "SELECT_TAB",
  SELECT_RESPONSE_TAB = "SELECT_RESPONSE_TAB",
  GET_TAB_STATE = "GET_TAB_STATE",
  SET_GRPC_RESPONSE = "SET_GRPC_RESPONSE",
  TOGGLE_STREAM = "TOGGLE_STREAM",
  UPDATE_TAB_NAMES = "UPDATE_TAB_NAMES",
}

export const mainActions = {
  getTabState: state => action(mainActionType.GET_TAB_STATE, state),

  addNewTab: (reducerFunc: {
    [funcName: string]: {
      getTabState: (state: any) => any;
      updateTabNames: (state: any) => any;
    };
  }) => action(mainActionType.ADD_NEW_TAB, reducerFunc),

  removeTab: (id: string) => action(mainActionType.REMOVE_TAB, id),

  selectTab: (id: string) => action(mainActionType.SELECT_TAB, id),

  toggleStream: (boolean: boolean) => action(mainActionType.TOGGLE_STREAM, boolean),

  updateTabNames: (obj: { [key: string]: string }) => action(mainActionType.UPDATE_TAB_NAMES, obj),

  selectResponseTab: (obj: { [key: string]: MainModel["selectedTab"]; mode: string }) =>
    action(mainActionType.SELECT_RESPONSE_TAB, obj),
};
