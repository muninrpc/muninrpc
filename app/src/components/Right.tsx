import * as React from "react";
import ReactJson from 'react-json-view';

export namespace RightProps {
  export interface Props {
    serverResponse: object;
    responseMetrics: string;
  }
}

export function Right(props: RightProps.Props, context?: any) {
  let responseDisplay = [];
  if (Object.keys(props.serverResponse).length) {
    responseDisplay.push(<ReactJson src={props.serverResponse}></ReactJson>)
  }
  return (
    <div className="right-half">
      <h2>Server Response</h2>
      <div className="response-display">{responseDisplay}</div>
      <div className="response-metrics" style={{color: 'green'}}>{Object.keys(props.serverResponse).length ? 'Success' : ''}</div>
    </div>
  );
}
