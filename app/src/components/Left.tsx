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
    serviceList: string[];
    requestList: string[];

    handleIPInput: any; // (value: string) => void;
    handleProtoUpload: any;
    setMode: any;

    mode: string;
  }
}

export default function Left(props: LeftProps.Props, context?: any) {
  let mode: React.ReactComponentElement<any, {}>;
  const { serviceList, requestList } = props;
  if (props.mode === 'service')
    mode = <Service serviceList={serviceList} requestList={requestList} />;
  if (props.mode === 'request') mode = <Request />;
  if (props.mode === 'setup') mode = <Setup />;

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
            <span className="file-path">{props.filePath}</span>
            <label className="file-upload">
              UPLOAD
              <input
                type="file"
                className="hide-me"
                placeholder="upload file"
                onChange={e => props.handleProtoUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          onClick={() => props.setMode('service')}
          className="service-button"
        >
          Service
        </button>
        <button
          onClick={() => props.setMode('request')}
          className="request-button"
        >
          Request
        </button>
        <button
          onClick={() => props.setMode('setup')}
          className="req-setup-button"
        >
          Request Setup
        </button>
      </div>
      <div className='main'>
        {mode}
      </div>
    </div>
  );
}
