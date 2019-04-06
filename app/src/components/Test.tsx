import * as React from "react";

export namespace TestProps {
  export interface Props {
    serverResponse: object;
    responseMetrics: string;
    addNewTab: any;
    removeTab: any;
  }
}


export function Test(props) {
  return (
    <div className={props.index}>
      <button id={props.index} className="subtract" onClick={() => props.removeTab(props.index)}>-</button>
      {props.pasta} is really {props.index}
    </div>
  )
} 

