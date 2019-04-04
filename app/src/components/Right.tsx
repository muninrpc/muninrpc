import * as React from "react";

export namespace RightProps {
  export interface Props {
    serverResponse: object;
    responseMetrics: string;
  }
}

export function Right(props: RightProps.Props, context?: any) {
  return (
    <div className="right-half">
      <h2>Server Response</h2>
      <div className="response-display">Placeholder</div>
      <div className="response-metrics">{props.responseMetrics}</div>
    </div>
  );
}
