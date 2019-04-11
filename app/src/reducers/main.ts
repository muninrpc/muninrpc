// import { RootState } from "./state";
import { mainActions } from "../actions";
import { RootState, Mode } from "../models/MainModel";
import * as cloneDeep from "lodash.clonedeep";
import { LeftFactory } from '../components/Left';
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  ClientStreamRequestBody,
  ServerStreamRequestBody,
  BidiStreamRequestBody,
  GrpcHandlerFactory,
  StreamAction,
} from "../../lib/local/grpcHandlerFactory";


const initialState: RootState.mainState = {
  handlers: {},
  selectedTab: 'tab0',
  leftArray: [],
  tabPrimaryKey: 0,
  serverResponses: {},
  responseMetrics: '',
  activeTab: {},
  isStreaming: false
};

export const mainReducer = (state: RootState = initialState, action: Types.RootAction) => {
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
      const newServerResponses = cloneDeep(state.serverResponses);
      newServerResponses[newSelectedTab] = {};
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
        serverResponses: newServerResponses
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

    //Unused
    // case mainActions.Type.HANDLE_SEND_REQUEST: {
    //   const newHandlers = cloneDeep(state.handlers)
    //   //Unary
    //   if (state.activeTab.requestConfig.callType === CallType.UNARY_CALL) {
    //     console.log('if')
    //     const requestConfig: RequestConfig<UnaryRequestBody> = {
    //       ...state.activeTab.requestConfig,
    //       reqBody: { argument: state.activeTab.configArguments.arguments },
    //     };
    //     const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
    //       ...state.activeTab.baseConfig,
    //       ...requestConfig,
    //     };
    //     const handler = GrpcHandlerFactory.createHandler(mergedConfig);
    //     newHandlers[state.selectedTab] = handler;
    //     console.log('handler:', handler)
    //   }

    //   //Client Stream
    //   if (state.activeTab.requestConfig.callType === CallType.CLIENT_STREAM) {
    //     const requestConfig: RequestConfig<ClientStreamRequestBody> = {
    //       ...state.activeTab.requestConfig,
    //       reqBody: {
    //         action: StreamAction.INITIATE
    //         //maybe callback?
    //       }
    //     };
    //     const mergedConfig: BaseConfig & RequestConfig<ClientStreamRequestBody> = {
    //       ...state.activeTab.baseConfig,
    //       ...requestConfig
    //     };
    //     const handler = GrpcHandlerFactory.createHandler(mergedConfig);
        
    //   }

    //   return {
    //     ...state,
    //     handlers: newHandlers
    //   }
    // }

    case mainActions.Type.SET_GRPC_RESPONSE: {
      let newServerResponses = cloneDeep(state.serverResponses)
      newServerResponses[state.selectedTab] = action.payload;
      return {
        ...state,
        serverResponses: newServerResponses
      };
    }

    case mainActions.Type.TOGGLE_STREAM: {
      return {
        ...state,
        isStreaming: action.payload
      }
    }

    default: {
      return state;
    }
  }
};
