import * as React from "react";

export namespace RightProps {
  export interface Props {
    serverResponse: string[];
    responseMetrics: string;
  }
}

export default function Right(props: RightProps.Props, context?: any) {
  return (
    <div className="right-half">
      <h2>Server Response</h2>
      <div className="response-display">{props.serverResponse}</div>
      <div className="response-metrics">{props.responseMetrics}</div>
    </div>
  );
}
