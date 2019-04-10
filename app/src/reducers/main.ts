import { RootState } from "./state";
import { mainActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as pbActions from "../../lib/local/pbActions";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";
import * as cloneDeep from "lodash.clonedeep";
import { LeftFactory } from '../components/Left';
import { array } from "prop-types";
import ServiceAndRequest from '../components/ServiceAndRequest'
import Messages from '../components/Messages' 
import Setup from '../components/Setup'  

const initialState: RootState.mainState = {
  handlers: [],
  selectedTab: 'tab0',
  leftArray: [],
  tabPrimaryKey: 0,
  serverResponse: {},
  responseMetrics: '',
  activeTab: {}
};

export const mainReducer = (state = initialState, action) => {
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

    default: {
      return state;
    }
  };
}
