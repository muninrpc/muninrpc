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
    <div className={'tab' + props.tabKey}>
      my primary key is {props.tabKey}
    </div>
  )
} 




