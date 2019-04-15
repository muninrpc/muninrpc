import { mainActions, mainRequestActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as cloneDeep from "lodash.clonedeep";
import { LeftFactory } from "../components/Left";
import * as Types from "MyTypes";

const initialState: MainModel = {
  handlers: {},
  selectedTab: "tab0",
  leftArray: [],
  tabPrimaryKey: 0,
  handlerInfo: {},
  activeTab: {},
  tabInfo: {},
};

export const mainReducer = (state: MainModel = initialState, action: Types.RootAction) => {
  switch (action.type) {
    case mainActions.Type.GET_TAB_STATE: {
      return {
        ...state,
        activeTab: {
          ...state.activeTab,
          ...action.payload,
        },
      };
    }

    case mainActions.Type.ADD_NEW_TAB: {
      const newLeftArray = cloneDeep(state.leftArray);
      const newSelectedTab = "tab" + state.tabPrimaryKey;
      const newHandlerInfo = cloneDeep(state.handlerInfo);

      // set initial handler info
      newHandlerInfo[newSelectedTab] = {
        serverResponse: [],
        isStreaming: false,
        responseMetrics: "",
      };
      // give location for handler to be stored
      state.handlers[newSelectedTab] = null;
      const newTabPrimaryKey = state.tabPrimaryKey + 1;
      const leftEle = LeftFactory({
        tabKey: newSelectedTab,
        getTabState: action.payload.getTabState,
        updateTabNames: action.payload.updateTabNames,
      });
      newLeftArray.push(leftEle);

      // create location for tab names to be stored
      const newTabInfo = cloneDeep(state.tabInfo);
      newTabInfo[newSelectedTab] = { name: "New Connection", activeResponseTab: "server" };

      return {
        ...state,
        leftArray: newLeftArray,
        tabPrimaryKey: newTabPrimaryKey,
        selectedTab: newSelectedTab,
        handlerInfo: newHandlerInfo,
        tabInfo: newTabInfo,
      };
    }

    case mainActions.Type.REMOVE_TAB: {
      // expect a payload of 'tabN' where N is the tabID
      let newLeftArray = cloneDeep(state.leftArray);
      let removeIdx;
      let newSelectedTab = state.selectedTab;

      // first search for the tab to delete
      newLeftArray.forEach((ele, idx) => {
        if (ele.key === action.payload) {
          removeIdx = idx;
        }
      });
      // logic if the deleted tab is currently selected

      if (state.selectedTab === action.payload) {
        // case - where there's nothing left to select
        if (state.leftArray.length === 1) {
          console.log("case0");
          newSelectedTab = "";
          // case - where you delete the last tab
        } else if (removeIdx === newLeftArray.length - 1) {
          console.log("case1");
          newSelectedTab = state.leftArray[removeIdx - 1].key.toString();
          // all other cases
        } else {
          console.log("case2");
          newSelectedTab = state.leftArray[removeIdx + 1].key.toString();
        }
      }
      // overwrite it with the consecutive elements
      for (let i = removeIdx; i < newLeftArray.length - 1; i++) {
        newLeftArray[i] = newLeftArray[i + 1];
      }
      newLeftArray.pop();

      return {
        ...state,
        leftArray: newLeftArray,
        selectedTab: newSelectedTab,
      };
    }

    case mainActions.Type.SELECT_TAB: {
      const newSelectedTab = action.payload;
      return {
        ...state,
        selectedTab: newSelectedTab,
      };
    }

    case mainActions.Type.SELECT_RESPONSE_TAB: {
      const newTabInfo = cloneDeep(state.tabInfo);
      newTabInfo[action.payload.selectedTab].activeResponseTab = action.payload.mode;
      return {
        ...state,
        tabInfo: newTabInfo,
      };
    }

    case mainActions.Type.UPDATE_TAB_NAMES: {
      const newTabInfo = cloneDeep(state.tabInfo);
      newTabInfo[action.payload.tabKey].name = action.payload.val;
      return {
        ...state,
        tabInfo: newTabInfo,
      };
    }

    case mainRequestActions.Type.SET_GRPC_RESPONSE: {
      let newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].serverResponse = action.payload;
      // console.log('action.payload inside of reducer', action.payload instanceof Error)
      if (action.payload instanceof Error) newHandlerInfo[state.selectedTab].responseMetrics.request = "ERROR";
      return {
        ...state,
        handlerInfo: newHandlerInfo,
      };
    }

    case mainActions.Type.TOGGLE_STREAM: {
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].isStreaming = action.payload;
      newHandlerInfo[state.selectedTab].serverResponse = {};
      return {
        ...state,
        handlerInfo: newHandlerInfo,
      };
    }

    case mainRequestActions.Type.HANDLE_SEND_MESSAGE: {
      state.handlers[state.selectedTab].write(state.activeTab.configArguments.arguments);
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `${state.activeTab.selectedRequest}: message sent.`,
      };

      return {
        ...state,
        handlerInfo: newHandlerInfo,
      };
    }

    case mainRequestActions.Type.HANDLE_RECIEVE_MESSAGE: {
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: `${state.activeTab.selectedRequest}: message recieved from server.`,
      };
      return {
        ...state,
        handlerInfo: newHandlerInfo,
      };
    }

    case mainRequestActions.Type.HANDLE_STOP_STREAM: {
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      // case - stopping a client push or bidi stream
      console.log("stopping stream");
      state.handlers[state.selectedTab].cancel();
      let request;
      if (action.payload === "server_end") {
        request = `${state.activeTab.selectedRequest}: con. terminated by server.`;
      } else {
        request = `${state.activeTab.selectedRequest}: con. terminated by client.`;
      }
      newHandlerInfo[state.selectedTab].responseMetrics = {
        timeStamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        request: request,
      };

      newHandlerInfo[state.selectedTab].isStreaming = false;

      return {
        ...state,
        handlerInfo: newHandlerInfo,
      };
    }

    default: {
      return state;
    }
  }
};
