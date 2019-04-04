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
      <pre className="response-display">{Object.keys(props.serverResponse).length ? JSON.stringify(props.serverResponse, null, 2) : ''}</pre>
      <div className="response-metrics">{Object.keys(props.serverResponse).length ? 'Success' : ''}</div>
    </div>
  );
}
