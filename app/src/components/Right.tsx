import * as React from "react";
import ReactJson from "react-json-view";
import { MainModel } from "../models";

interface RightActions {
  selectResponseTab: any;
}

export function Right(props: MainModel & RightActions, context?: any) {
  const { selectResponseTab, tabInfo, handlerInfo, selectedTab, leftArray } = props;

  let timeStamp = leftArray[0] ? handlerInfo[selectedTab].responseMetrics.timeStamp : "";
  timeStamp = timeStamp ? `[${timeStamp}]` : "";

  let serverTabClass = "tab";
  let clientTabClass = "tab";

  if (leftArray[0]) {
    if (tabInfo[selectedTab].activeResponseTab === "server") {
      serverTabClass = "selected tab";
      clientTabClass = "tab";
    } else {
      serverTabClass = "tab";
      clientTabClass = "selected tab";
    }
  }

  // logic for parsing correct response json
  let serverJSON: [] | {} = [];
  let clientJSON: [] | {} = [];
  let displayedJSON: [] | {} = [];

  if (props.leftArray[0]) {
    if (Array.isArray(props.handlerInfo[props.selectedTab].serverResponse)) {
      props.handlerInfo[props.selectedTab].serverResponse.forEach(message => {
        // console.log('message:', message)
        if (message.type === "read") serverJSON.push(message.payload);
        if (message.type === "write") clientJSON.push(message.payload);
      });
    } else {
      serverJSON = props.handlerInfo[props.selectedTab].serverResponse;
    }

    displayedJSON = tabInfo[selectedTab].activeResponseTab === "server" ? serverJSON : clientJSON;
    // console.log('displayed JSON', displayedJSON)
    // console.log('server JSON', serverJSON)
    // console.log('client JSON', clientJSON)
  }

  return (
    <div className="right-half">
      <div className={"right-header-box"}>
        <h2 className={serverTabClass} onClick={() => selectResponseTab({ selectedTab: selectedTab, mode: "server" })}>
          SERVER RESPONSES
        </h2>
        <h2 className={clientTabClass} onClick={() => selectResponseTab({ selectedTab: selectedTab, mode: "client" })}>
          CLIENT MESSAGES
        </h2>
      </div>
      <div className="response-display">
        <ReactJson
          theme={"monokai"}
          iconStyle={"circle"}
          indentWidth={2}
          displayDataTypes={false}
          src={displayedJSON}
        />
      </div>
      <div className="response-metrics">
        {leftArray[0] ? <span className="metrics-time">{timeStamp}</span> : ""}
        {leftArray[0] ? (
          <span className="metrics-request">{handlerInfo[selectedTab].responseMetrics.request}</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
