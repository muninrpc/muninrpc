import { mainActions, mainRequestActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as cloneDeep from "lodash.clonedeep";
import { LeftFactory } from '../components/Left';
import * as Types from "MyTypes";

const initialState: MainModel = {
  handlers: {},
  selectedTab: 'tab0',
  leftArray: [],
  tabPrimaryKey: 0,
  handlerInfo: {},
  // responseMetrics: '', //move to inside of handlerInfo
  activeTab: {},
};

export const mainReducer = (state: MainModel = initialState, action: Types.RootAction) => {

  switch (action.type) {

    case mainActions.Type.GET_TAB_STATE : {
      return {
        ...state,
        activeTab: {
          ...state.activeTab,
          ...action.payload
        }
      }
    }

    case mainActions.Type.ADD_NEW_TAB : {
      const newLeftArray = cloneDeep(state.leftArray)
      const newSelectedTab = 'tab' + state.tabPrimaryKey;
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      // set initial handler info
      newHandlerInfo[newSelectedTab] = {
        serverResponse: {},
        isStreaming: false,
        responseMetrics: ''
      }
      // give location for handler to be stored
      state.handlers[newSelectedTab] = null;
      const newTabPrimaryKey = state.tabPrimaryKey + 1;
      const leftEle = LeftFactory({
        tabKey: newSelectedTab, getTabState: action.payload
      })
      newLeftArray.push(leftEle)

      return ({
        ...state,
        leftArray: newLeftArray,
        tabPrimaryKey: newTabPrimaryKey,
        selectedTab: newSelectedTab,
        handlerInfo: newHandlerInfo
      })
    }

    case mainActions.Type.REMOVE_TAB : {

      // expect a payload of 'tabN' where N is the tabID
      let newLeftArray = cloneDeep(state.leftArray);
      let removeIdx;
      let newSelectedTab = state.selectedTab;

      // first search for the tab to delete
      newLeftArray.forEach( (ele, idx) => {
        if(ele.key === action.payload) {
          removeIdx = idx;
        }
      })
      // logic if the deleted tab is currently selected

      if( state.selectedTab === action.payload) {
        // case - where there's nothing left to select
        if(state.leftArray.length === 1) {
          console.log('case0')
          newSelectedTab = '';
        // case - where you delete the last tab
        } else if(removeIdx === newLeftArray.length - 1) {
          console.log('case1')
          newSelectedTab = state.leftArray[removeIdx - 1].key;
        // all other cases
        } else {
          console.log('case2')
          newSelectedTab = state.leftArray[removeIdx + 1].key;
        }
      }
      // overwrite it with the consecutive elements
      for(let i=removeIdx; i<newLeftArray.length - 1; i++) {
        newLeftArray[i] = newLeftArray[i+1];
      }
      newLeftArray.pop();

      return {
        ...state,
        leftArray: newLeftArray,
        selectedTab: newSelectedTab,
      }
    }

    case mainActions.Type.SELECT_TAB : {
      const newSelectedTab = action.payload
      return {
        ...state,
        selectedTab: newSelectedTab
      }
    }

    case mainRequestActions.Type.SET_GRPC_RESPONSE: {
      let newHandlerInfo = cloneDeep(state.handlerInfo)
      newHandlerInfo[state.selectedTab].serverResponse = action.payload;
      return {
        ...state,
        handlerInfo: newHandlerInfo
      };
    }

    case mainActions.Type.TOGGLE_STREAM: {
      const newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].isStreaming = action.payload;
      return {
        ...state,
        handlerInfo: newHandlerInfo
      }
    }

    case mainRequestActions.Type.HANDLE_SEND_MESSAGE: {
      state.handlers[state.selectedTab].write(state.activeTab.configArguments.arguments)
      let newHandlerInfo = cloneDeep(state.handlerInfo);
      newHandlerInfo[state.selectedTab].responseMetrics = `Message sent at: ${(new Date()).toLocaleTimeString()}`
      return {
        ...state,
        handlerInfo: newHandlerInfo
      }
    }

    default: {
      return state;
    } 
  }
};
