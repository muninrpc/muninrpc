import * as React from "react";
import ReactJson from 'react-json-view';

export interface RightProps {
  serverResponse: object;
  responseMetrics: string;
}


export function Right(props: RightProps, context?: any) {
  
  return (
    <div className="right-half">
      <h2>Server Response</h2>
      <div className="response-display">
        <ReactJson src={props.leftArray[0] ? props.handlerInfo[props.selectedTab].serverResponse : {}} />
      </div>
      <div className="response-metrics">{props.leftArray[0] ? props.handlerInfo[props.selectedTab].responseMetrics : ''}</div>
    </div>
  );
}
