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
<<<<<<< HEAD
import * as cloneDeep from 'lodash.clonedeep'
import { handleAsyncActions } from 'redux-actions-async';
import { clone } from "@babel/types";
=======
>>>>>>> b321881c0d2b55612ea3fb479194f1d6b7f75a03

const initialState: RootState.mainState = {
  baseConfig: { grpcServerURI: "", packageDefinition: null, packageName: "", serviceName: "" },
  configArguments: { arguments: {} },
  configElements: { arguments: {} },
  filePath: "",
  messageList: {},
  messageTrie: new Trie(),
  messageTrieInput: "",
  messageRecommendations: [],
  mode: MainModel.Mode.SHOW_SERVICE,
  requestConfig: { requestName: "", callType: null, reqBody: {} },
  requestTrie: new Trie(),
  responseMetrics: "got2go fast",
  serviceList: {},
  serviceRecommendations: [],
  serverResponse: {},
  selectedService: null,
  selectedRequest: null,
  serviceTrie: new Trie(),
  serviceTrieInput: "",
  trail: "",
  // targetIP: "",
  // connectType: "Select an RPC",
  // packageDefinition: null,
};

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case mainActions.Type.HANDLE_IP_INPUT: {
      let newTrail: string;
      if (action.payload === "") {
        newTrail = ` `;
      } else {
        newTrail = `${action.payload} → ${state.selectedService} → ${state.selectedRequest}`;
      }
      return {
        ...state,
        trail: newTrail,
        baseConfig: { ...state.baseConfig, grpcServerURI: action.payload },
      };
    }

    case mainActions.Type.HANDLE_SERVICE_CLICK: {
      let writtenIP = "IP";
      if (state.baseConfig.grpcServerURI) {
        writtenIP = state.baseConfig.grpcServerURI;
      }
      if (action.payload.service === "") {
        return {
          ...state,
          selectedService: "",
          selectedRequest: "",
          trail: writtenIP,
          baseConfig: { ...state.baseConfig, packageName: "", serviceName: "" },
          requestConfig: { ...state.requestConfig, requestName: "", callType: null },
        };
      }
      const newTrail = writtenIP + " → " + action.payload.service;
      return {
        ...state,
        selectedService: action.payload.service,
        trail: newTrail,
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
      let newTrail: string;
      let writtenIP = "IP";
      if (state.baseConfig.grpcServerURI) {
        writtenIP = state.baseConfig.grpcServerURI;
      }
      if (state.selectedService) {
        //let regexedString = action.payload.match(/(?<=→\ ).+/)
        newTrail = `${writtenIP} → ${state.selectedService} → ${action.payload.request}`;
      } else {
        newTrail = `${writtenIP} → ${action.payload.service} → ${action.payload.request}`;
      }

      const { requestStream, responseStream } = state.serviceList[action.payload.service][
        action.payload.request
      ];
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
              parseService(
                state.messageList[f.typeName].type,
                configArguments[f.name],
                configElements[f.name],
              );
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
              parseService(
                state.messageList[f.typeName].type,
                configArguments[f.name][0],
                configElements[f.name][0],
              );
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
        trail: newTrail,
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
    }

    case mainActions.Type.HANDLE_PROTO_UPLOAD: {
      const filePath = action.payload[0].path;
      const packageDefinition = pbActions.loadProtoFile(filePath);

      const { protoServices, protoMessages } = pbActions.parsePackageDefinition(packageDefinition);

      console.log("protoservices", protoServices, "protomessages", protoMessages);

      const newServiceTrie = new Trie();
      newServiceTrie.insertArrayOfWords(Object.keys(protoServices));

      let requestWordsArr: string[] = [];
      Object.keys(protoServices).forEach(service => {
        requestWordsArr = [...requestWordsArr, ...Object.keys(protoServices[service])];
      });

      const newRequestTrie = new Trie();
      newRequestTrie.insertArrayOfWords(requestWordsArr);

      const newMessageTrie = new Trie();
      newMessageTrie.insertArrayOfWords(Object.keys(protoMessages));

      return {
        ...state,
        filePath: filePath,
        serviceList: protoServices,
        serviceTrie: newServiceTrie,
        requestTrie: newRequestTrie,
        messageTrie: newMessageTrie,
        messageList: protoMessages,
        baseConfig: { ...state.baseConfig, packageDefinition: packageDefinition },
      };
    }

    case mainActions.Type.HANDLE_SET_MODE: {
      return {
        ...state,
        mode: action.payload,
      };
    }

    case mainActions.Type.HANDLE_SERVICE_TRIE: {
      return {
        ...state,
        serviceTrieInput: action.payload,
        serviceRecommendations: state.serviceTrie.recommend(action.payload),
      };
    }

    case mainActions.Type.HANDLE_MESSAGE_TRIE: {
      return {
        ...state,
        messageTrieInput: action.payload,
        messageRecommendations: state.messageTrie.recommend(action.payload),
      };
    }

    case mainActions.Type.HANDLE_CONFIG_INPUT: {
      let keys = action.payload.id.split(".").slice(1);
      function findNestedValue(context, keyArray) {
        // base case
        if (keyArray.length === 1) {
          return context;
        }
        // recu case
        if (keyArray[0].match("@")) {
          let loc = Number(keyArray[0].match(/\d+$/)[0]);
          let con = keyArray[0];
          con = con.match(/(.+)@/)[1];
          return findNestedValue(context[con][loc], keyArray.slice(1));
        } else {
          return findNestedValue(context[keyArray[0]], keyArray.slice(1));
        }
      }

      // find the correct location
      let context = findNestedValue(state.configArguments.arguments, keys);

      if (keys[keys.length - 1].includes("@")) {
        let key = keys[keys.length - 1].match(/(.+)@/)[1];
        let pos = Number(keys[keys.length - 1].match(/\d+$/)[0]);
        context[key][pos] = action.payload.value;
      } else {
        context[keys[keys.length - 1]] = action.payload.value;
      }

      return {
        ...state,
      };
    }

    case mainActions.Type.HANDLE_REPEATED_CLICK: {
      let keys = action.payload.id.split(".").slice(1);
      function findNestedValue(context, keyArray) {
        // base case
        if (keyArray.length === 1) {
          return context;
        }
        // recu case
        if (keyArray[0].match("@")) {
          let loc = Number(keyArray[0].match(/\d+$/)[0]);
          let con = keyArray[0];
          con = con.match(/(.+)@/)[1];
          return findNestedValue(context[con][loc], keyArray.slice(1));
        } else {
          return findNestedValue(context[keyArray[0]], keyArray.slice(1));
        }
      }

      // find the correct location
      let context = findNestedValue(state.configArguments.arguments, keys);
      let baseKey = keys[keys.length-1].match(/(.+)@/)[1];
      let baseLoc = Number(keys[keys.length-1].match(/\d+$/)[0])

      // console.log(context)
      // console.log(baseKey)
      // console.log(baseLoc)

      if(action.payload.request === 'add' ) {
        context[baseKey][context[baseKey].length] = cloneDeep(context[baseKey][context[baseKey].length-1])  
      } 

      if(action.payload.request === 'remove' ) {
        for(let i=baseLoc; i<context[baseKey].length-1; i++){
          context[baseKey][i] = context[baseKey][i+1]
        }
        context[baseKey].pop();
      } 

      const newConfigArguments = cloneDeep(state.configArguments) 

      return {
        ...state,
        configArguments: newConfigArguments
      }
    }

    case mainActions.Type.HANDLE_SEND_REQUEST: {
      if (state.requestConfig.callType === CallType.UNARY_CALL) {
        const requestConfig: RequestConfig<UnaryRequestBody> = {
          ...state.requestConfig,
          reqBody: { argument: state.configArguments.arguments },
        };
        const mergedConfig: BaseConfig & RequestConfig<UnaryRequestBody> = {
          ...state.baseConfig,
          ...requestConfig,
        };
        const handler = GrpcHandlerFactory.createHandler(mergedConfig);
        handler.initiateRequest().then(response => {
          console.log("response", response);
          return {
            ...state,
            serverResponse: response,
          };
        });
      }
    }

    default: {
      return state;
    }
  }
};