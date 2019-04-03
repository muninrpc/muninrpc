import * as React from "react";
import ServiceAndRequest from "./ServiceAndRequest";
import Messages from "./Messages";
import Setup from "./Setup";
import { MainModel } from "../models/MainModel";
import { Trie } from "../utils/trieClass";

export namespace LeftProps {
  export interface Props {
    responseDisplay?: string;
    responseMetrics?: string;
    targetIP: string;
    filePath: string;
    trail?: string;
    connectType?: string;
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
    mode: string;
    handleIPInput: any; // (value: string) => void;
    handleProtoUpload: any;
    setMode: any;
    handleServiceClick: any;
    handleRequestClick: any;

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
  if (props.mode === MainModel.Mode.SHOW_SERVICE) {
    mode = <ServiceAndRequest {...props} />;
  }
  if (props.mode === MainModel.Mode.SHOW_MESSAGES) {
    mode = <Messages {...props} />;
  }
  if (props.mode === MainModel.Mode.SHOW_SETUP) {
    mode = <Setup {...props} />;
  }

  return (
    <div className="left">
      <div className="input-header">
        <div className="address-box">
          <h3>Target Server IP</h3>
          <input
            type="text"
            value={props.targetIP}
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
              <input
                type="file"
                className="hide-me"
                onChange={e => props.handleProtoUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          onClick={() => props.setMode(MainModel.Mode.SHOW_SERVICE)}
          className={
            "service-and-request-button " +
            (props.mode === MainModel.Mode.SHOW_SERVICE ? "selected" : "")
          }
        >
          SERVICES & REQUESTS
        </button>
        <button
          disabled={Object.keys(props.messageList).length ? false : true}
          onClick={() => props.setMode(MainModel.Mode.SHOW_MESSAGES)}
          className={
            "messages-button " + (props.mode === MainModel.Mode.SHOW_MESSAGES ? "selected" : "")
          }
        >
          MESSAGES
        </button>
        <button
          disabled={props.selectedRequest ? false : true}
          onClick={() => props.setMode(MainModel.Mode.SHOW_SETUP)}
          className={
            "req-setup-button " + (props.mode === MainModel.Mode.SHOW_SETUP ? "selected" : "")
          }
        >
          REQUEST SETUP
        </button>
      </div>
      <div className="main">{mode}</div>
    </div>
  );
}
