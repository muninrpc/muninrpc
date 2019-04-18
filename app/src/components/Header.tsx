import * as React from "react";
import { CallType } from "../../lib/local/grpcHandlerFactory";
import { MainModel } from "../models";
import { actions } from "../actions";
import { JSXElement } from "@babel/types";

export function Header(props: MainModel & actions, context?: any) {
  const {
    setGRPCResponse,
    updateTabNames,
    handlerInfo,
    handleClientStreamStart,
    handleServerStreamStart,
    handleBidiStreamStart,
    handleUnaryRequest,
    toggleStream,
    activeTab,
    getTabState,
    selectTab,
    removeTab,
    addNewTab,
    leftArray,
    selectedTab,
    handleStopStream,
  } = props;

  let userConnectType: string;
  let callType: CallType;
  let trail: string;
  if (activeTab.requestConfig) {
    callType = activeTab.requestConfig.callType;
    trail = activeTab.baseConfig.grpcServerURI ? `${activeTab.baseConfig.grpcServerURI} → ` : "";
    trail += activeTab.selectedService ? `${activeTab.selectedService}` : "";
    trail += activeTab.selectedRequest ? ` → ${activeTab.selectedRequest}` : "";
  }

  //logic for what the buttons do
  let displayButton = <button disabled={true}>SEND REQUEST</button>;

  const sendRequestButton = (
    <button className="send-req-btn" onClick={handleUnaryRequest}>
      SEND REQUEST
    </button>
  );

  const startClientStreamButton = (
    <button
      className="start-stream-btn"
      onClick={() => {
        handleClientStreamStart();
        toggleStream(true);
      }}
    >
      START STREAM
    </button>
  );

  const startServerStreamButton = (
    <button
      className="start-stream-btn"
      onClick={() => {
        handleServerStreamStart();
        toggleStream(true);
      }}
    >
      START STREAM
    </button>
  );

  const startBidiStreamButton = (
    <button
      className="start-stream-btn"
      onClick={() => {
        handleBidiStreamStart();
        toggleStream(true);
      }}
    >
      START STREAM
    </button>
  );

  const writeToStreamButton = (
    <button className="write-stream-btn" onClick={props.handleSendMessage}>
      SEND MESSAGE
    </button>
  );

  const stopStreamButtonEnabled = (
    <button className="stop-button" onClick={() => handleStopStream()}>
      STOP STREAM
    </button>
  )

  const stopStreamButtonDisabled = (
    <button className="stop-button" disabled={true} onClick={() => handleStopStream()}>
      STOP STREAM
    </button>
  )

  switch (callType) {
    case CallType.UNARY_CALL: {
      userConnectType = "UNARY";
      displayButton = sendRequestButton;
      break;
    }
    case CallType.SERVER_STREAM: {
      userConnectType = "SERVER STREAM";
      displayButton = startServerStreamButton;
      break;
    }
    case CallType.CLIENT_STREAM: {
      userConnectType = "CLIENT STREAM";
      displayButton = handlerInfo[selectedTab].isStreaming ? writeToStreamButton : startClientStreamButton;
      break;
    }
    case CallType.BIDI_STREAM: {
      userConnectType = "BIDIRECTIONAL";
      displayButton = handlerInfo[selectedTab].isStreaming ? writeToStreamButton : startBidiStreamButton;
      break;
    }
    default: {
      userConnectType = "Select an RPC";
    }
  }

  const tabArray = [];

  leftArray.forEach(tab => {
    const tabKey = tab.props.tabKey;
    let displayedTabName: string;
    props.tabInfo[tabKey] ? (displayedTabName = props.tabInfo[tabKey].name) : (displayedTabName = "New Tab");
    tabArray.push(
      <div
        key={"button" + tab.key}
        className={tab.key === selectedTab ? "tab selected" : "tab"}
        onClick={() => selectTab(tab.key as string)}
      >
        {props.tabInfo[tabKey] ? props.tabInfo[tabKey].name : "Connection"}
        {props.leftArray.length > 1 ? (
          <button
            onClick={e => {
              e.stopPropagation();
              removeTab(tab.key as string);
            }}
          >
            x
          </button>
        ) : (
          ""
        )}
      </div>,
    );
  });

  let stopStreamButton = stopStreamButtonDisabled;

  if (handlerInfo[selectedTab]) {
    if(handlerInfo[selectedTab].isStreaming) displayButton = writeToStreamButton;
    stopStreamButton = handlerInfo[selectedTab].isStreaming ? stopStreamButtonEnabled : stopStreamButtonDisabled;
  }


  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="trail">{trail}</div>
          <div className="connection-display">{userConnectType}</div>
          {displayButton}
          {stopStreamButton}
        </div>
        <div className="header-right">
          <h1>MuninRPC</h1>
          <img className="logo" src="./src/assets/raven.png" />
        </div>
      </div>

      <div className="header-tabs">
        <div className="tab-box">
          {tabArray}
          <button
            className="add"
            //@ts-ignore
            onClick={() => addNewTab({ getTabState: getTabState, updateTabNames: updateTabNames, setGRPCResponse: setGRPCResponse })}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
