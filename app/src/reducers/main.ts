import { mainActions } from "../actions";
import { TabState, Mode } from "../models/TabModel";
import * as pbActions from "../../lib/local/pbActions";
import { CallType } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";
import * as cloneDeep from "lodash.clonedeep";
<<<<<<< HEAD
import * as Types from "MyTypes";

const initialState: TabState = {
  baseConfig: { grpcServerURI: "", packageDefinition: null, packageName: "", serviceName: "" },
  configArguments: { arguments: {} },
  configElements: { arguments: {} },
  filePath: "",
  messageList: {},
  messageTrie: new Trie(),
  messageTrieInput: "",
  messageRecommendations: [],
  mode: Mode.SHOW_SERVICE,
  requestConfig: { requestName: "", callType: null, reqBody: {} },
  requestTrie: new Trie(),
  responseMetrics: "",
  serviceList: {},
  serviceRecommendations: [],
  serverResponse: {},
  selectedService: null,
  selectedRequest: null,
  serviceTrie: new Trie(),
  serviceTrieInput: "",
=======
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
>>>>>>> a4647b4e77639c4d3465771312582e03c10af937
};

export const mainReducer = (state: TabState = initialState, action: Types.RootAction) => {
  switch (action.type) {
<<<<<<< HEAD
    case mainActions.Type.HANDLE_IP_INPUT: {
      return {
        ...state,
        baseConfig: { ...state.baseConfig, grpcServerURI: action.payload },
      };
    }

    case mainActions.Type.HANDLE_SERVICE_CLICK: {
      //deselects service upon clicking outside of service list
      if (action.payload.service === "") {
        return {
          ...state,
          selectedService: "",
          selectedRequest: "",
          baseConfig: { ...state.baseConfig, packageName: "", serviceName: "" },
          requestConfig: { ...state.requestConfig, requestName: "", callType: null },
        };
      }
      return {
        ...state,
        selectedService: action.payload.service,
        baseConfig: {
          ...state.baseConfig,
          packageName: action.payload.service.match(/(.+)\./)[1],
          serviceName: action.payload.service.match(/\.(.+)/)[1],
        },
      };
    }

    case mainActions.Type.HANDLE_REQUEST_CLICK: {
      //if there is a selectedservice, then add service + regex'd request string
      //else add just request string

      const { requestStream, responseStream } = state.serviceList[action.payload.service][action.payload.request];
      let newConnectType: string;

      if (requestStream && responseStream) {
        newConnectType = CallType.BIDI_STREAM;
      } else if (!requestStream && !responseStream) {
        newConnectType = CallType.UNARY_CALL;
      } else if (requestStream && !responseStream) {
        newConnectType = CallType.CLIENT_STREAM;
      } else if (!requestStream && responseStream) {
        newConnectType = CallType.SERVER_STREAM;
      } else {
        newConnectType = "ERROR";
      }

      // logic for assembling the arguments object
      function parseService(typeArray, configArguments, configElements) {
        // console.log(configElements)
        // console.log(typeArray)
        // 5 possible cases:
        // case: fields array is empty
        if (typeArray.field.length === 0) {
          configArguments = null;
          configElements[typeArray.name] = {
            name: typeArray.name,
            type: "TYPE_MESSAGE",
            label: "LABEL_OPTIONAL",
          };
        } else {
          typeArray.field.forEach(f => {
            // case: not a message and not repeating
            if (f.type !== "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
              configArguments[f.name] = null;
              // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
              configElements[f.name] = {
                messageName: typeArray.name,
                type: f.type,
                label: f.label,
              };
            }
            // case: not a message and repeating
            if (f.type !== "TYPE_MESSAGE" && f.label === "LABEL_REPEATED") {
              configArguments[f.name] = [null];
              // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
              configElements[f.name] = {
                name: f.name,
                messageName: typeArray.name,
                type: f.type,
                label: f.label,
              };
            }
            // case: message and not repeating
            if (f.type === "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
              configArguments[f.name] = {};
              // if(!configElements[f.name]) configElements[f.name] = {}
              configElements[f.name] = {
                name: f.name,
                label: f.label,
                type: f.type,
                typeName: f.typeName,
              };
              parseService(state.messageList[f.typeName].type, configArguments[f.name], configElements[f.name]);
            }
            // case: message and repeating
            if (f.type == "TYPE_MESSAGE" && f.label == "LABEL_REPEATED") {
              configArguments[f.name] = [{}];
              configElements[f.name] = [
                {
                  messageName: typeArray.name,
                  label: f.label,
                  type: f.type,
                  typeName: f.typeName,
                },
              ];
              parseService(state.messageList[f.typeName].type, configArguments[f.name][0], configElements[f.name][0]);
            }
          });
        }
      }
      let newConfigArguments = { arguments: {} };
      let newConfigElements = { arguments: {} };
      parseService(
        state.serviceList[action.payload.service][action.payload.request].requestType.type,
        newConfigArguments.arguments,
        newConfigElements.arguments,
      );

      return {
        ...state,
        selectedService: action.payload.service,
        selectedRequest: action.payload.request,
        configArguments: newConfigArguments,
        configElements: newConfigElements,
        baseConfig: {
          ...state.baseConfig,
          packageName: action.payload.service.match(/(.+)\./)[1],
          serviceName: action.payload.service.match(/\.(.+)/)[1],
        },
        requestConfig: {
          ...state.requestConfig,
          requestName: action.payload.request,
          callType: newConnectType,
        },
      };
=======

    case mainActions.Type.GET_TAB_STATE : {
      return {
        ...state,
        activeTab: {
          ...state.activeTab,
          ...action.payload
        }
      }
>>>>>>> a4647b4e77639c4d3465771312582e03c10af937
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
<<<<<<< HEAD

      // find the correct location
      let context = findNestedValue(state.configArguments.arguments, keys);
      let baseKey = keys[keys.length - 1].match(/(.+)@/)[1];
      let baseLoc = Number(keys[keys.length - 1].match(/\d+$/)[0]);

      // console.log(context)
      // console.log(baseKey)
      // console.log(baseLoc)

      if (action.payload.request === "add") {
        context[baseKey][context[baseKey].length] = cloneDeep(context[baseKey][context[baseKey].length - 1]);
      }

      if (action.payload.request === "remove") {
        for (let i = baseLoc; i < context[baseKey].length - 1; i++) {
          context[baseKey][i] = context[baseKey][i + 1];
        }
        context[baseKey].pop();
      }

      const newConfigArguments = cloneDeep(state.configArguments);

      return {
        ...state,
        configArguments: newConfigArguments,
      };
    }

    // case mainActions.Type.HANDLE_SEND_REQUEST: {
    //   if (state.requestConfig.callType === CallType.UNARY_CALL) {
    //     const requestConfig: RequestConfig<UnaryRequestBody> = {
    //       ...state.requestConfig,
    //       reqBody: { argument: state.configArguments.arguments },
    //     };
    //     const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
    //       ...state.baseConfig,
    //       ...requestConfig,
    //     };
    //     const handler = GrpcHandlerFactory.createHandler(mergedConfig);
    //     handler.initiateRequest().then(response => {
    //       return {
    //         ...state,
    //         serverResponse: response,
    //       };
    //     });
    //   }
    // }

    case mainActions.Type.SET_GRPC_RESPONSE: {
      return {
        ...state,
        serverResponse: action.payload,
      };
=======
    }

    case mainActions.Type.SELECT_TAB : {
      const newSelectedTab = action.payload
      return {
        ...state,
        selectedTab: newSelectedTab
      }
>>>>>>> a4647b4e77639c4d3465771312582e03c10af937
    }

    default: {
      return state;
    }
  }
};
