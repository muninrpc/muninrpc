import * as React from 'react';
import { MainModel } from '../models/MainModel';

export namespace HeaderProps {
  export interface Props {
    trail?: string;
    connectType?: string;
    serviceList: any;
    selectedService: string;
    selectedRequest: string;
  }
}


export default function Header(props: HeaderProps.Props, context?: any) {
  const { serviceList, selectedService, selectedRequest } = props
  let connectionType = 'Select an RPC';
  if (serviceList && selectedService && selectedRequest) {
    let reqInfo = serviceList[selectedService][selectedRequest];
    switch (`${reqInfo.requestStream}, ${reqInfo.responseStream}`) {
      case (`true, true`):
        connectionType = 'BINARY'
        break;
      case (`false, false`):
        connectionType = 'UNARY'
        break;
      case (`false, true`):
        connectionType = 'PUSH'
        break;
      case (`true, false`):
        connectionType = 'UNARY?'
        break;
      default:
        connectionType = 'ERROR'
        break;

    }
  }
  return(
    <div className="header">
      <div className="header-left">
        <div className="trail">{props.trail}</div>
        <div className="connection-display">{connectionType}</div>
        <button className="send-button">SEND REQUEST</button>
      </div>
      <div className="right">
        <h1>MuninRPC</h1>
        <img className="logo" src="./src/assets/raven.png" />
      </div>
    </div>
  )
}