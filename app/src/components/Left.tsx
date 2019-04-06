import * as React from "react";
import ServiceAndRequest from "./ServiceAndRequest";
import Messages from "./Messages";
import Setup from "./Setup";
import { Mode } from "../models/MainModel";
import * as protoLoader from "@grpc/proto-loader";
import { Trie } from "../utils/trieClass";
import { BaseConfig } from "../../lib/local/grpcHandlerFactory";

export namespace LeftProps {
  export interface Props {
    responseDisplay?: string;
    responseMetrics?: string;
    filePath: string;
    trail?: string;
    serviceList: { [index: string]: protoLoader.ServiceDefinition };
    messageList: any;
    selectedService: string;
    selectedRequest: string;
    mode: string;
    baseConfig: BaseConfig;

    configElements: any;
    configArguments: any;

    handleIPInput: any; // (value: string) => void;
    handleProtoUpload: any;
    setMode: any;
    handleServiceClick: any;
    handleRequestClick: any;
    handleRepeatedClick: any;
    handleConfigInput: any;

    handleServiceTrie: any;
    serviceRecommendations: string[];
    serviceTrieInput: string;

    handleMessageTrie: any;
    messageTrieInput: string;
    messageRecommendations: string[];
  }
}

export function Left(props: LeftProps.Props, context?: any) {
  let mode: React.ReactComponentElement<any, {}>;
  if (props.mode === Mode.SHOW_SERVICE) {
    mode = <ServiceAndRequest {...props} />;
  }
  if (props.mode === Mode.SHOW_MESSAGES) {
    mode = <Messages {...props} />;
  }
  if (props.mode === Mode.SHOW_SETUP) {
    mode = <Setup {...props} />;
  }

  return (
    <div className="left">
      <div className="input-header">
        <div className="address-box">
          <h3>Target Server IP</h3>
          <input
            type="text"
            value={props.baseConfig.grpcServerURI}
            placeholder=""
            onChange={e => props.handleIPInput(e.target.value)}
          />
        </div>
        <div className="upload-box">
          <h3>Upload .proto file</h3>
          <div className="upload-box-contents">
            <div className="file-path">{props.filePath}</div>
            <div className="file-path-spacer" />
            <label className="file-upload">
              UPLOAD
              <input type="file" className="hide-me" onChange={e => props.handleProtoUpload(e.target.files)} />
            </label>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          onClick={() => props.setMode(Mode.SHOW_SERVICE)}
          className={"service-and-request-button " + (props.mode === Mode.SHOW_SERVICE ? "selected" : "")}
        >
          SERVICES & REQUESTS
        </button>
        <button
          disabled={Object.keys(props.messageList).length ? false : true}
          onClick={() => props.setMode(Mode.SHOW_MESSAGES)}
          className={"messages-button " + (props.mode === Mode.SHOW_MESSAGES ? "selected" : "")}
        >
          MESSAGES
        </button>
        <button
          disabled={props.selectedRequest ? false : true}
          onClick={() => props.setMode(Mode.SHOW_SETUP)}
          className={"req-setup-button " + (props.mode === Mode.SHOW_SETUP ? "selected" : "")}
        >
          REQUEST SETUP
        </button>
      </div>
      <div className="main">{mode}</div>
    </div>
  );
}
