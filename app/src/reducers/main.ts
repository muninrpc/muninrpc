import { handleActions } from "redux-actions";
import { RootState } from "./state";
import { mainActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as pbActions from "../../lib/local/pbActions";
import { CallType } from "../../lib/local/grpcHandlerFactory";
import { rpc } from "protobufjs";
import { ftruncate } from "fs";

const initialState: RootState.mainState = {
  responseMetrics: "got2go fast",
  targetIP: "",
  filePath: "",
  trail: "",
  connectType: "Select an RPC",
  mode: MainModel.Mode.SHOW_SERVICE,
  serviceList: [],
  messageList: {},
  serverResponse: ["response from server will go here"],
  packageDefinition: null,
  selectedService: null,
  selectedRequest: null,
  configArguments: { arguments: {} },
  configElements: { arguments: {} }
};

export const mainReducer = handleActions<RootState.mainState, MainModel>(
  {
    [mainActions.Type.HANDLE_IP_INPUT]: (state, action: { payload: string }) => {
      let newTrail: string;
      if (action.payload === "") {
        newTrail = ` `;
      } else {
        newTrail = `${action.payload} → ${state.selectedService} → ${state.selectedRequest}`;
      }
      return {
        ...state,
        targetIP: action.payload,
        trail: newTrail
      };
    },
    [mainActions.Type.HANDLE_SERVICE_CLICK]: (state, action: { payload: string }) => {
      let writtenIP = "IP";
      if (state.targetIP) {
        writtenIP = state.targetIP;
      }
      const newTrail = writtenIP + " → " + action.payload.service;
      return {
        ...state,
        selectedService: action.payload.service,
        trail: newTrail
      };
    },
    [mainActions.Type.HANDLE_REQUEST_CLICK]: (
      state,
      action: { payload: { request: string; service: string } }
    ) => {
      //if there is a selectedservice, then add service + regex'd request string
      //else add just request string
      let newTrail: string;
      let writtenIP = "IP";
      if (state.targetIP) writtenIP = state.targetIP;
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
            type: 'TYPE_MESSAGE',
            label:'LABEL_OPTIONAL'
          }
        } else {
          typeArray.field.forEach( f => {
            // case: not a message and not repeating
            if(f.type !== "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
              configArguments[f.name] = null;
              // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
              configElements[f.name] = {
                messageName: typeArray.name,
                type: f.type,
                label: f.label
              };
            }
            // case: not a message and repeating
            if(f.type !== "TYPE_MESSAGE" && f.label === "LABEL_REPEATED") {
              configArguments[f.name] = [null];
              // if(!configElements[typeArray.name]) configElements[typeArray.name] = {}
              configElements[f.name] = {
                name: f.name,
                messageName: typeArray.name,
                type: f.type,
                label: f.label
              }
            }
            // case: message and not repeating
            if(f.type === "TYPE_MESSAGE" && f.label !== "LABEL_REPEATED") {
              configArguments[f.name] = {};
              // if(!configElements[f.name]) configElements[f.name] = {}
              configElements[f.name] = {
                name: f.name,
                label: f.label,
                type: f.type,
                typeName: f.typeName
              }
              parseService(state.messageList[f.typeName].type, configArguments[f.name], configElements[f.name])
            }
            // case: message and repeating
            if(f.type == "TYPE_MESSAGE" && f.label == "LABEL_REPEATED") {
              configArguments[f.name] = [{}]
              configElements[f.name] = [{
                messageName: typeArray.name,
                label: f.label,
                type: f.type,
                typeName: f.typeName
              }]
              parseService(state.messageList[f.typeName].type, configArguments[f.name][0], configElements[f.name][0])
            }
          })
        }
      }
      let newConfigArguments = { arguments: {} }
      let newConfigElements = { arguments : {} }
      parseService(
        state.serviceList[action.payload.service][action.payload.request].requestType.type, 
        newConfigArguments.arguments, 
        newConfigElements.arguments
      ) 

      return {
        ...state,
        selectedService: action.payload.service,
        selectedRequest: action.payload.request,
        connectType: newConnectType,
        trail: newTrail,
        configArguments: newConfigArguments,
        configElements: newConfigElements
      };
    },

    [mainActions.Type.HANDLE_PROTO_UPLOAD]: (state, action) => {
      const filePath = action.payload[0].path;
      const packageDefinition = pbActions.loadProtoFile(filePath);
      //console.log('from reducer, parsed Package Definition:', pbActions.parsePackageDefinition(packageDefinition))
      const { protoServices, protoMessages } = pbActions.parsePackageDefinition(packageDefinition);

      return {
        ...state,
        filePath: filePath,
        packageDefinition: packageDefinition,
        serviceList: protoServices,
        messageList: protoMessages
      };
    },
    [mainActions.Type.HANDLE_SET_MODE]: (state, action) => ({
      ...state,
      mode: action.payload
    }),

    [mainActions.Type.HANDLE_CONFIG_INPUT]: (state, action: {payload: {id: string, value: string}) => {
      let keys = action.payload.id.split('.').slice(1)
      function findNestedValue(context, keyArray) {
        // base case
        if (keyArray.length === 1) {
          return context;
        }
        // recu case
        if(keyArray[0].match('@')) {
          let loc = Number(keyArray[0].match(/\d+$/)[0])
          let con = keyArray[0]
          con = con.match(/(.+)@/)[1]
          return findNestedValue(context[con][loc], keyArray.slice(1))
        } else {
          return findNestedValue(context[keyArray[0]], keyArray.slice(1))
        }
      }

      // find the correct location
      let context = findNestedValue(state.configArguments.arguments, keys)

      if( keys[keys.length-1].includes('@') ) {
        let key = keys[keys.length-1].match(/(.+)@/)[1] 
        let pos = Number(keys[keys.length-1].match(/\d+$/)[0])
        context[key][pos] = action.payload.value;
      } else {
        context[keys[keys.length-1]] = action.payload.value
      }

      return {
        ...state
      }
    },
    [mainActions.Type.HANDLE_REPEATED_CLICK]: (state, action) => ({
      ...state,
      arguments: action.payload
    })

  },
  initialState
);
