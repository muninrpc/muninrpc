import * as React from "react";
import { useState } from "react";
import ServiceAndRequest from "./ServiceAndRequest";
import Messages from "./Messages";
import Setup from "./Setup";
import * as pbActions from "../../lib/local/pbActions";
import { Trie } from "../utils/trieClass";
import { parseService } from "../utils/parseService";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";
import * as cloneDeep from "lodash.clonedeep";

interface LeftProps {
  handlerContext: [];
  tabKey: string;
  filePath: string;
  serviceList: [];
  messageList: [];
  selectedService: string;
  selectedRequest: string;
  mode: string;
  baseConfig: {};
  configElements: {};
  configArguments: {};
}

enum Mode {
  SHOW_SERVICE = "SERVICE_AND_REQUEST",
  SHOW_MESSAGES = "MESSAGES",
  SHOW_SETUP = "SETUP",
}

export const LeftFactory = props => {
  let closureState;
  if (!closureState)
    closureState = {
      tabKey: props.tabKey,
      getTabState: props.getTabState,

      handlerContext: [],
      filePath: "",
      serviceList: {},
      messageList: [],
      selectedService: "",
      selectedRequest: "",
      mode: "SERVICE_AND_REQUEST",
      baseConfig: { grpcServerURI: 'localhost:50052' },
      requestConfig: {},

      configElements: {},
      configArguments: {},

      messageRecommendations: [],
      messageTrie: new Trie(),
      messageTrieInput: "",

      requestRecommendations: [],
      requestTrie: new Trie(),
      requestTrieInput: "",

      serviceRecommendations: [],
      serviceTrie: new Trie(),
      serviceTrieInput: "",
    };

  function Left(props: LeftProps) {
    // state management
    const [state, updateState] = useState(closureState);
    closureState = state;
    state.getTabState({ ...cloneDeep(closureState) });

    // user input management
    const handleRequestClick = payload => {
      const { requestStream, responseStream } = state.serviceList[payload.service][payload.request];
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

      let newConfigArguments = { arguments: {} };
      let newConfigElements = { arguments: {} };

      // mutates newConfigArgs and newConfigEles to reflect the proto file
      parseService(
        state.serviceList[payload.service][payload.request].requestType.type,
        newConfigArguments.arguments,
        newConfigElements.arguments,
        state,
      );

      updateState({
        ...state,
        selectedService: payload.service,
        selectedRequest: payload.request,
        configArguments: newConfigArguments,
        configElements: newConfigElements,
        baseConfig: {
          ...state.baseConfig,
          packageName: payload.service.match(/(.+)\./)[1],
          serviceName: payload.service.match(/\.(.+)/)[1],
        },
        requestConfig: {
          ...state.requestConfig,
          requestName: payload.request,
          callType: newConnectType,
        }
      });
    };

    const handleServiceClick = payload => {
      //deselects service upon clicking outside of service list
      if (payload.service === "") {
        updateState({
          ...state,
          selectedService: "",
          selectedRequest: "",
          baseConfig: { ...state.baseConfig, packageName: "", serviceName: "" },
          requestConfig: { ...state.requestConfig, requestName: "", callType: null },
        });
      }

      updateState({
        ...state,
        selectedService: payload.service,
        baseConfig: {
          ...state.baseConfig,
          packageName: payload.service.match(/(.+)\./)[1],
          serviceName: payload.service.match(/\.(.+)/)[1],
        }
      });
    };

    const handleServiceTrie = val =>
      updateState({
        ...state,
        serviceTrieInput: val,
        serviceRecommendations: state.serviceTrie.recommend(val),
      });
    const handleMessageTrie = val =>
      updateState({
        ...state,
        messageTrieInput: val,
        messageRecommendations: state.messageTrie.recommend(val),
      });
    const handleRequestTrie = val =>
      updateState({
        ...state,
        requestTrieInput: val,
        // requestRecommendations: state.requestTrie.recommend(val) // NOT YET IMPLEMENTED
      });
    const handleIPInput = val => 
      updateState({
        ...state,
        baseConfig: { ...state.baseConfig, grpcServerURI: val },
      });
    
    const handleProtoUpload = file => {
      // handle file
      const filePath = file[0].path;
      const packageDefinition = pbActions.loadProtoFile(filePath);
      const { protoServices, protoMessages } = pbActions.parsePackageDefinition(packageDefinition);

      // populate tries
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

      updateState({
        ...state,
        filePath: filePath,
        serviceList: protoServices,
        messageList: protoMessages,
        serviceTrie: newServiceTrie,
        requestTrie: newRequestTrie,
        messageTrie: newMessageTrie,
        baseConfig: { ...state.baseConfig, packageDefinition: packageDefinition },
      });
    };

    const handleRepeatedClick = payload => {
      let keys = payload.id.split(".").slice(1);
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
      let baseKey = keys[keys.length - 1].match(/(.+)@/)[1];
      let baseLoc = Number(keys[keys.length - 1].match(/\d+$/)[0]);

      // console.log(context)
      // console.log(baseKey)
      // console.log(baseLoc)

      if (payload.request === "add") {
        context[baseKey][context[baseKey].length] = cloneDeep(context[baseKey][context[baseKey].length - 1]);
        context[baseKey][context[baseKey].length - 1] = "";
      }

      if (payload.request === "remove") {
        for (let i = baseLoc; i < context[baseKey].length - 1; i++) {
          context[baseKey][i] = context[baseKey][i + 1];
        }
        context[baseKey].pop();
      }

      const newConfigArguments = cloneDeep(state.configArguments);

      updateState({
        ...state,
        configArguments: newConfigArguments,
      });
    };

    const handleConfigInput = payload => {
      let keys = payload.id.split(".").slice(1);
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
        context[key][pos] = payload.value;
      } else {
        context[keys[keys.length - 1]] = payload.value;
      }

      updateState({
        ...state,
      });
    };

    // mode management
    const setMode = val => updateState({ ...state, mode: val });
    let mode: React.ReactComponentElement<any, {}>;
    if (state.mode === Mode.SHOW_SERVICE) {
      mode = (
        <ServiceAndRequest
          {...state}
          handleServiceTrie={handleServiceTrie}
          handleRequestTrie={handleRequestTrie}
          handleMessageTrie={handleMessageTrie}
          handleRequestClick={handleRequestClick}
          handleServiceClick={handleServiceClick}
        />
      );
    }
    if (state.mode === Mode.SHOW_MESSAGES) {
      mode = <Messages {...state} />;
    }
    if (state.mode === Mode.SHOW_SETUP) {
      mode = <Setup {...state} handleRepeatedClick={handleRepeatedClick} handleConfigInput={handleConfigInput} />;
    }
  
    return (
      <div id="tab">
        <h1 onClick={() => console.log(state)} style={{ color: "black" }}> 
          {state.tabKey}
        </h1>
        <div className="input-header">
          <div className="address-box">
            <h3>Target Server IP</h3>
            <input
              type="text"
              value={state.baseConfig.grpcServerURI}
              placeholder=""
              onChange={e => handleIPInput(e.target.value)}
            />
          </div>
          <div className="upload-box">
            <h3>Upload .proto file</h3>
            <div className="upload-box-contents">
              <div className="file-path">{state.filePath}</div>
              <div className="file-path-spacer" />
              <label className="file-upload">
                UPLOAD
                <input type="file" className="hide-me" onChange={e => handleProtoUpload(e.target.files)} />
              </label>
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            onClick={() => setMode(Mode.SHOW_SERVICE)}
            className={"service-and-request-button " + (state.mode === Mode.SHOW_SERVICE ? "selected" : "")}
          >
            SERVICES & REQUESTS
          </button>
          <button
            disabled={Object.keys(state.messageList).length ? false : true}
            onClick={() => setMode(Mode.SHOW_MESSAGES)}
            className={"messages-button " + (state.mode === Mode.SHOW_MESSAGES ? "selected" : "")}
          >
            MESSAGES
          </button>
          <button
            disabled={state.selectedRequest ? false : true}
            onClick={() => setMode(Mode.SHOW_SETUP)}
            className={"req-setup-button " + (state.mode === Mode.SHOW_SETUP ? "selected" : "")}
          >
            REQUEST SETUP
          </button>
        </div>

        <div className="main">
          {mode}
        </div>
      </div>
    );
  }
  return <Left key={props.tabKey} {...props} />;
};

