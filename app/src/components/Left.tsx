import * as React from 'react';
import ServiceAndRequest from './ServiceAndRequest';
import Messages from './Messages';
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
    messageList: any;
    selectedService: string;
    selectedRequest: string;

    handleIPInput: any; // (value: string) => void;
    handleProtoUpload: any;
    setMode: any;
    handleServiceClick: any;
    handleRequestClick: any;

    mode: string;
  }
}

export default function Left(props: LeftProps.Props, context?: any) {
  let mode: React.ReactComponentElement<any, {}>;
  const { serviceList, messageList, handleServiceClick, handleRequestClick, selectedService, selectedRequest } = props;
  if (props.mode === 'service_and_request')
    mode = <ServiceAndRequest serviceList={serviceList} messageList={messageList} handleServiceClick={handleServiceClick} handleRequestClick={handleRequestClick} selectedService={selectedService}
    selectedRequest={selectedRequest}/>;
  if (props.mode === 'messages') mode = <Messages messageList={props.messageList} />;
  if (props.mode === 'setup') mode = <Setup serviceList={serviceList} messageList={messageList} selectedService={selectedService} selectedRequest={selectedRequest}/>;

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
            <div className="file-path">{props.filePath}</div>
            <div className="file-path-spacer"></div>
            <label className="file-upload">
              UPLOAD
              <input
                type="file"
                className="hide-me"
                onChange={e => props.handleProtoUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          onClick={() => props.setMode('service_and_request')}
          className={"service-and-request-button " + (props.mode === 'service_and_request' ? 'selected' : '')}
        >
          SERVICES & REQUESTS
        </button>
        <button
          disabled={Object.keys(messageList).length ? false : true}
          onClick={() => props.setMode('messages')}
          className={"messages-button " + (props.mode === 'messages' ? 'selected' : '')}
        >
          MESSAGES
        </button>
        <button
          disabled={selectedRequest ? false : true}
          onClick={() => props.setMode('setup')}
          className={"req-setup-button " + (props.mode === 'setup' ? 'selected' : '')}
        >
          REQUEST SETUP
        </button>
      </div>
      <div className='main'>
        {mode}
      </div>
    </div>
  );
}
