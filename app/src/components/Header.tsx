import * as React from 'react';
import { MainModel } from '../models/MainModel';

export namespace HeaderProps {
  export interface Props {
    trail?: string;
    connectType?: string;
  }
}


export default function Header(props: HeaderProps.Props, context?: any) {
  return(
    <div className="header">
      <div className="left">
        <div className="trail">?</div>
        <div className="connection-display">UNARY</div>
        <button className="send-button">SEND REQUEST</button>
      </div>
      <div className="right">>
        <h1>MuninRPC</h1>
        <img className="logo" src="./src/assets/raven.png" />
      </div>
    </div>
  )
}