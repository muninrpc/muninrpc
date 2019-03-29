import * as React from 'react';
import Service from './Service';
import Request from './Request';
import Setup from './Setup';
import { MainModel } from '../models/MainModel';

export namespace LeftProps {
  export interface Props {
    responseDisplay?: string;
    responseMetrics?: string;
    targetIP: string;
    filePath: string;
    trail?: string;
    connectType?: string;
    handleIPInput: any // (value: string) => void;
    handleProtoUpload: any
  }
}


export default function Left(props: LeftProps.Props, context?: any) { 
  return (
    <div className="left">
      <div className="input-header">
        <div className="address-box">
          <h3>Target Server IP</h3>
          <input type="text" value={props.targetIP} placeholder="" onChange={(e) => props.handleIPInput(e.target.value)}/>
        </div>
        <div className="upload-box">
          <h3>Upload .proto file</h3>
          <div className="upload-box-contents">
            <label className="file-upload">
              upload
              <input
                type="file"
                className="hide-me"
                placeholder="upload file"
                onChange={(e) => props.handleProtoUpload(e.target.files)}
              />
            </label>
            <span className="file-path">
              {props.filePath}
            </span>
          </div>
        </div>
      </div>
      <div className="main">
        <Service />
        <Request />
        <Setup />
      </div>
      <div className="footer-left">
        <div className="trail">?</div>
        <div className="connection-display">unary</div>
        <button className="send-button">Send</button>
      </div>
    </div>
  );
}
