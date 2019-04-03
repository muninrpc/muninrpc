import { handleActions } from "redux-actions";
import { RootState } from "./state";
import { mainActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as pbActions from "../../lib/local/pbActions";
import { CallType } from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";

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
  serviceTrie: new Trie(),
  requestTrie: new Trie(),
  serviceRecommendations: [],
  serviceTrieInput: ""
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
        trail: newTrail,
      };
    },
    [mainActions.Type.HANDLE_SERVICE_CLICK]: (state, action: { payload: { service: string } }) => {
      let writtenIP = "IP";
      if (state.targetIP) {
        writtenIP = state.targetIP;
      }
      if (action.payload.service === '') {
        return {
          ...state,
          selectedService: '',
          selectedRequest: ''
          trail: writtenIP
        }
      }
      const newTrail = writtenIP + " → " + action.payload.service;
      
      return {
        ...state,
        selectedService: action.payload.service,
        trail: newTrail,
      };
    },
    [mainActions.Type.HANDLE_REQUEST_CLICK]: (
      state,
      action: { payload: { request: string; service: string } },
    ) => {

      //if there is a selectedservice, then add service + regex'd request string
      //else add just request string
      let newTrail: string;
      let writtenIP = "IP";
      if (state.targetIP) {
        writtenIP = state.targetIP;
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

      return {
        ...state,
        selectedService: action.payload.service,
        selectedRequest: action.payload.request,
        connectType: newConnectType,
        trail: newTrail,
      };
    },

    [mainActions.Type.HANDLE_PROTO_UPLOAD]: (state, action) => {
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

      return {
        ...state,
        filePath: filePath,
        packageDefinition: packageDefinition,
        serviceList: protoServices,
        serviceTrie: newServiceTrie,
        requestTrie: newRequestTrie,
        messageList: protoMessages,
      };
    },
    [mainActions.Type.HANDLE_SET_MODE]: (state, action) => ({
      ...state,
      mode: action.payload,
    }),
    [mainActions.Type.HANDLE_SERVICE_TRIE] : (state, action) => {
      return {
        ...state,
        serviceTrieInput: action.payload,
        serviceRecommendations: state.serviceTrie.recommend(action.payload)
      }
    }
  },
  initialState,
);
