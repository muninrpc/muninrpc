import * as React from "react";
import { MainModel } from "../models/MainModel";
import { CallType, RequestConfig, BaseConfig } from "../../lib/local/grpcHandlerFactory";

export interface HeaderActions{
  getTabState: any;
  addNewTab: any;
  removeTab: any;
  selectTab: any;
  toggleStream: any;
  handleSendRequest: any;
}


export function Header(props: MainModel & HeaderActions, context?: any) {
  const { handleSendRequest, toggleStream, activeTab, getTabState, selectTab, removeTab, addNewTab, leftArray, selectedTab } = props; 

  let sendButtonText = "SEND REQUEST";
  let userConnectType;
  let callType;
  let trail;
  if(activeTab.requestConfig) {
    callType = activeTab.requestConfig.callType;
    trail = activeTab.baseConfig.grpcServerURI ? `${activeTab.baseConfig.grpcServerURI} →` : '';
    trail += activeTab.selectedService ? `${activeTab.selectedService}` : '';
    trail += activeTab.selectedRequest ? ` → ${activeTab.selectedRequest}` :'';
  }

  switch (callType) {
    case CallType.UNARY_CALL: {
      userConnectType = "UNARY";
      sendButtonText = "SEND REQUEST";
      break;
    }
    case CallType.SERVER_STREAM: {
      userConnectType = "SERVER STREAM";
      sendButtonText = props.isStreaming ? "SEND MESSAGE" : "START STREAM";
      break;
    }
    case CallType.CLIENT_STREAM: {
      userConnectType = "CLIENT STREAM";
      sendButtonText = props.isStreaming ? "SEND MESSAGE" : "START STREAM";
      break;
    }
    case CallType.BIDI_STREAM: {
      userConnectType = "BIDIRECTIONAL";
      sendButtonText = props.isStreaming ? "SEND MESSAGE" : "START STREAM";
      break;
    }
    default: {
      userConnectType = "Select an RPC";
    }
  }

  const tabArray = [];

  leftArray.forEach( (tab) => { 
    tabArray.push(
      <div key={'button' + tab.key} className={tab.key === selectedTab ? 'tab selected' : 'tab'} onClick={ () => selectTab(tab.key) }>
        {tab.key}
        <button onClick={ 
          (e) => {
            e.stopPropagation();
            removeTab(tab.key) 
          } 
        }>
          x
        </button>
      </div>
    )
  });

  let sendButtonFunc;
  if (props.isStreaming === true) {
    // if we're in stream mode, Send button becomes a write
    sendButtonFunc = () => props.handlers[props.selectedTab].write(props.activeTab.configArguments.arguments)
  } else { //if not in stream mode
    if (callType !== CallType.UNARY_CALL) {
      sendButtonFunc = () => { // Send button becomes a start stream button
        toggleStream(true)
        handleSendRequest()
      }
    } else {
      sendButtonFunc = handleSendRequest
    }
  }
  
  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="trail">
            {trail}
          </div>
          <div className="connection-display">
            {userConnectType}
          </div>
          <button
            className="send-button"
            onClick={sendButtonFunc}
            // disabled={props.baseConfig.grpcServerURI.length ? false : true}
          >
            {sendButtonText}
          </button>
          <button className="stop-button">
            STOP STREAM
          </button>
        </div>
        <div className="header-right">
          <h1>MuninRPC</h1>
          <img className="logo" src="./src/assets/raven.png" />
        </div>
      </div>

      <div className="header-tabs">
        <div className="tab-box">
          {tabArray}
          <button className="add" onClick={() => addNewTab(getTabState)}>+</button> 
        </div>
      </div>

    </div>
  );
}
