import * as React from "react";
import { MainModel } from "../models/MainModel";
import { CallType, RequestConfig, BaseConfig } from "../../lib/local/grpcHandlerFactory";

export interface HeaderProps{
  selectedTab: MainModel['selectedTab'];
  leftArray: MainModel['leftArray'];
  addNewTab: any;
  removeTab: any;
}


export function Header(props: HeaderProps, context?: any) {
  const { removeTab, addNewTab, leftArray, selectedTab } = props
  // const { selectedRequest, selectedService } = props.leftArray[selectedTab];

  // let userConnectType;

  // switch (callType) {
  //   case CallType.UNARY_CALL: {
  //     userConnectType = "UNARY";
  //     break;
  //   }
  //   case CallType.SERVER_STREAM: {
  //     userConnectType = "SERVER STREAM";
  //     break;
  //   }
  //   case CallType.CLIENT_STREAM: {
  //     userConnectType = "CLIENT STREAM";
  //     break;
  //   }
  //   case CallType.BIDI_STREAM: {
  //     userConnectType = "BIDIRECTIONAL";
  //     break;
  //   }
  //   default: {
  //     userConnectType = "Select an RPC";
  //   }
  // }
  

  return (
    <div className="header">
      <div className="header-tabs">
        <div className="tab-box">
          <button onClick={() => props.addNewTab(removeTab)}>+</button> 
        </div>
      </div>
    </div>
  );
}
