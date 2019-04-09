import * as React from "react";
import { useState, useEffect, useRef } from "react";
import ServiceAndRequest from "./ServiceAndRequest";
import Messages from "./Messages";
import Setup from "./Setup";
import * as pbActions from "../../lib/local/pbActions";
import * as protoLoader from "@grpc/proto-loader";
import { Trie } from "../utils/trieClass";
import { mainActions } from "../actions";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";
import * as cloneDeep from "lodash.clonedeep";
import * as Types from "MyTypes";
import { render } from "react-dom";


interface LeftProps {
  handlerContext: [],
  tabKey: string,
  filePath: string,
  serviceList: [],
  messageList: [],
  selectedService: string,
  selectedRequest: string,
  mode: string,
  baseConfig: {},
  configElements: {},
  configArguments: {} 
}

enum Mode {
  SHOW_SERVICE = "SERVICE_AND_REQUEST",
  SHOW_MESSAGES = "MESSAGES",
  SHOW_SETUP = "SETUP",
}

export const LeftFactory = (props) => {
  let closureState;
  if (!closureState) closureState = {
    children: props.children,
    tabKey: props.tabKey,
    handlerContext: [],
    filePath: '',
    serviceList: {},
    messageList: [],
    selectedService: '',
    selectedRequest: '',
    mode: 'SERVICE_AND_REQUEST',
    baseConfig: {},

    configElements: {},
    configArguments: {},

    messageRecommendations: [],
    messageTrie: new Trie(),
    messageTrieInput: "",
    
    requestTrie: new Trie(),
    requestTrieInput: "",
    
    serviceRecommendations: [],
    serviceTrie: new Trie(),
    serviceTrieInput: "",

  }

  function Left(props:LeftProps) {
    
    // state management
    const [state, updateState] = useState(closureState);
    closureState = state;
    
    // user input management
    const handleRequestClick = (payload) => {

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

      // logic for assembling the arguments object
      function parseService(typeArray, configArguments, configElements) {
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
        state.serviceList[payload.service][payload.request].requestType.type,
        newConfigArguments.arguments,
        newConfigElements.arguments,
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
        },
      });
    }

    const handleServiceClick = (payload) => {
      //deselects service upon clicking outside of service list
      if (payload.service === "") {
        return {
          ...state,
          selectedService: "",
          selectedRequest: "",
          baseConfig: { ...state.baseConfig, packageName: "", serviceName: "" },
          requestConfig: { ...state.requestConfig, requestName: "", callType: null },
        };
      }
      updateState({
        ...state,
        selectedService: payload.service,
        baseConfig: {
          ...state.baseConfig,
          packageName: payload.service.match(/(.+)\./)[1],
          serviceName: payload.service.match(/\.(.+)/)[1],
        },
      });
    }

    const handleServiceTrie = (val) => updateState({
      ...state,
      serviceTrieInput: val,
      serviceRecommendations: state.serviceTrie.recommend(val)
    })
    const handleMessageTrie = (val) => updateState({
      ...state,
      messageTrieInput: val,
      messageRecommendations: state.messageTrie.recommend(val)
    })
    const handleIPInput = (val) => updateState({
      ...state, 
      baseConfig: {...state.baseConfig, grpcServerURI: val } 
    })
    const handleProtoUpload = (file) => {
      const filePath = file[0].path;
      const packageDefinition = pbActions.loadProtoFile(filePath);
      const { protoServices, protoMessages } = pbActions.parsePackageDefinition(packageDefinition);

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
      })
    
    }

    // mode management
    const setMode = (val) => updateState({...state, mode: val})
    let mode: React.ReactComponentElement<any, {}>;
    if (state.mode === Mode.SHOW_SERVICE) {
      mode = <ServiceAndRequest 
        {...state} 
        handleServiceTrie={handleServiceTrie} 
        handleMessageTrie={handleMessageTrie} 
        handleRequestClick={handleRequestClick}
        handleServiceClick={handleServiceClick}
      />;
    }
    if (state.mode === Mode.SHOW_MESSAGES) {
      mode = <Messages {...state} />;
    }
    if (state.mode === Mode.SHOW_SETUP) {
      mode = <Setup {...state} />; 
    }
    
    console.log(state)

    return (
      <div className={state.tabKey}>
      <h1 style={ {color: 'black'} }>{state.tabKey}</h1>
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
          {/* <Messages {...state} /> */}
          {/* <Setup {...state} /> */}
        </div>

      </div>
    )
  }

  return <Left key={props.tabKey} {...props} />

}