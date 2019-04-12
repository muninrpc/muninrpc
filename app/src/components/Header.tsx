import * as React from "react";
import { CallType, RequestConfig, BaseConfig } from "../../lib/local/grpcHandlerFactory";
import { MainModel } from "../models"
export interface HeaderActions {
  getTabState: any;
  addNewTab: any;
  removeTab: any;
  selectTab: any;
  toggleStream: any;
  handleUnaryRequest: any;
  handleClientStreamStart: any;
  handleSendMessage: any;
  
}

export function Header(props: MainModel & HeaderActions, context?: any) {

  const { handlerInfo, handlers, handleClientStreamStart, handleUnaryRequest, toggleStream, activeTab, getTabState, selectTab, removeTab, addNewTab, leftArray, selectedTab } = props; 

  let userConnectType;
  let callType;
  let trail;
  if (activeTab.requestConfig) {
    callType = activeTab.requestConfig.callType;
    trail = activeTab.baseConfig.grpcServerURI ? `${activeTab.baseConfig.grpcServerURI} → ` : "";
    trail += activeTab.selectedService ? `${activeTab.selectedService}` : "";
    trail += activeTab.selectedRequest ? ` → ${activeTab.selectedRequest}` : "";
  }

  //logic for what the buttons do
  let displayButton = (<button>SEND REQUEST</button>);

  const sendRequestButton = 
    (<button className='send-req-btn' onClick={handleUnaryRequest}>SEND REQUEST</button>)

  const startClientStreamButton = 
    (<button 
      className='start-stream-btn' 
      onClick={ () => { 
        handleClientStreamStart(); 
        toggleStream(true); 
      }
    }>START STREAM</button>)

  const writeToStreamButton = 
    (<button className='write-stream-btn' onClick={props.handleSendMessage}>SEND MESSAGE</button>)

  switch (callType) {
    case CallType.UNARY_CALL: {
      userConnectType = "UNARY";
      displayButton = sendRequestButton;
      break;
    }
    case CallType.SERVER_STREAM: {
      userConnectType = "SERVER STREAM";
      // displayButton = startServerStreamButton;
      break;
    }
    case CallType.CLIENT_STREAM: {
      userConnectType = "CLIENT STREAM";
      displayButton = handlerInfo[selectedTab].isStreaming ? writeToStreamButton : startClientStreamButton; 
      break;
    }
    case CallType.BIDI_STREAM: {
      userConnectType = "BIDIRECTIONAL";
      // displayButton = startBidiStreamButton;      
      break;
    }
    default: {
      userConnectType = "Select an RPC";
    }
  }

  const tabArray = [];

  leftArray.forEach(tab => {
    tabArray.push(
      <div
        key={"button" + tab.key}
        className={tab.key === selectedTab ? "tab selected" : "tab"}
        onClick={() => selectTab(tab.key)}
      >
        {tab.props.tabKey}
        {props.leftArray.length > 1 ? <button
          onClick={e => {
            e.stopPropagation();
            removeTab(tab.key);
          }}
        >
          x
        </button> : ''}
      </div>
    );
  });

  let disabledFlag;
  if(handlerInfo[selectedTab]) disabledFlag = handlerInfo[selectedTab].isStreaming ? false : true;
  
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
          {displayButton}
          <button 
            className="stop-button" disabled={disabledFlag}
            onClick={() => {
              handlers[selectedTab].end();
              handlerInfo[selectedTab].responseMetrics = `Stream ended at: ${(new Date()).toLocaleTimeString()}`
              toggleStream(false);
             }}
          >
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
          <button className="add" onClick={() => addNewTab(getTabState)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
