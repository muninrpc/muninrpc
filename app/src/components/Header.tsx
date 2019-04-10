import * as React from "react";
import { CallType, RequestConfig, BaseConfig } from "../../lib/local/grpcHandlerFactory";

export interface HeaderActions {
  getTabState: any;
  addNewTab: any;
  removeTab: any;
  selectTab: any;
}

export function Header(props: MainModel & HeaderActions, context?: any) {
  const { activeTab, getTabState, selectTab, removeTab, addNewTab, leftArray, selectedTab } = props;

  let userConnectType;
  let callType;
  let trail;
  if (activeTab.requestConfig) {
    callType = activeTab.requestConfig.callType;
    trail = activeTab.baseConfig.grpcServerURI ? `${activeTab.baseConfig.grpcServerURI} →` : "";
    trail += activeTab.selectedService ? `${activeTab.selectedService}` : "";
    trail += activeTab.selectedRequest ? ` → ${activeTab.selectedRequest}` : "";
  }

  switch (callType) {
    case CallType.UNARY_CALL: {
      userConnectType = "UNARY";
      break;
    }
    case CallType.SERVER_STREAM: {
      userConnectType = "SERVER STREAM";
      break;
    }
    case CallType.CLIENT_STREAM: {
      userConnectType = "CLIENT STREAM";
      break;
    }
    case CallType.BIDI_STREAM: {
      userConnectType = "BIDIRECTIONAL";
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
        {tab.key}
        <button
          onClick={e => {
            e.stopPropagation();
            removeTab(tab.key);
          }}
        >
          x
        </button>
      </div>,
    );
  });

  return (
    <div className="header">
      <div className="header-top">
        <div className="header-left">
          <div className="trail">{trail}</div>
          <div className="connection-display">{userConnectType}</div>
          <button
            className="send-button"
            // onClick={props.handleSendRequest}
            // disabled={props.baseConfig.grpcServerURI.length ? false : true}
          >
            SEND REQUEST
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
