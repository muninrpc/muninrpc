import * as React from 'react';

<<<<<<< HEAD
export namespace RightProps {
  export interface Props {
    serverResponse: string[];
    responseMetrics: string
  }
}

export default function Right(props: RightProps.Props, context?: any) {
  return (
    <div className="right-half">
      <h2>Server Response</h2>
      <div className="response-display">{props.serverResponse}</div>
      <div className="response-metrics">{props.responseMetrics}</div>
=======
export default function Right() {
  return (
    <div className="right">
      <h2>Server Response</h2>
      <div className="response-display">!!!</div>
      <div className="response-metrics">Response metrics</div>
>>>>>>> 5637aa5cc7bedfb06204d16c52f1007a3aaafb66
    </div>
  );
}
