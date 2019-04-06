import * as React from "react";
import { CallType, RequestConfig, BaseConfig } from "../../lib/local/grpcHandlerFactory";

type HeaderProps = {
  handleSendRequest: () => (dispatch: any, getState: any) => void;
  requestConfig: RequestConfig<any>;
  baseConfig: BaseConfig;
  selectedService: string;
  selectedRequest: string;
};

export function Header(props: HeaderProps, context?: any) {
  const { callType } = props.requestConfig;

  let userConnectType: string;

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

  return (
    <div className="header">
      <div className="header-left">
        <div className="trail">
          {props.baseConfig.grpcServerURI ? `${props.baseConfig.grpcServerURI} →` : ""}
          {props.selectedService ? `${props.selectedService}` : ""}
          {props.selectedRequest ? ` → ${props.selectedRequest}` : ""}
        </div>
        <div className="connection-display">{userConnectType}</div>
        <button
          className="send-button"
          onClick={props.handleSendRequest}
          disabled={props.baseConfig.grpcServerURI.length ? false : true}
        >
          SEND REQUEST
        </button>
      </div>
      <div className="right">
        <h1>MuninRPC</h1>
        <img className="logo" src="./src/assets/raven.png" />
      </div>
    </div>
  );
}
