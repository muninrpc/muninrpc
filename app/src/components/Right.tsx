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
      <div className="response-display"></div>
      <div className="response-metrics"></div>
    </div>
  );
}
