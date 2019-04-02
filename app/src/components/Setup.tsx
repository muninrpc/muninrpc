import * as React from "react";
import { element } from "prop-types";
import { JSXSpreadChild } from "@babel/types";

export namespace SetupProps {
  export interface Props {
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
    argumentsArray: any[];

    handleRepeatedClick: any;
    handleConfigInput: any;
  }
}

export default function Setup(props: SetupProps.Props, context?: any) {
  let { handleConfigInput, handleRepeatedClick, serviceList, selectedService, selectedRequest } = props;

  function createListItem(name, label, type, depth) {

  }

  function generateFields(field: any[], messageName: string, path = '', depth = 1): JSX.Element[] | JSX.Element  {
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

    if (field.length === 0) {
      return <p className="no-fields">This message has no fields.</p>;
    } else {
      let elementsArray = [];
      elementsArray.push(<h2>{messageName}</h2>);
      field.forEach(value => {
        if (typeof value === "object" && !Array.isArray(value)) {
          let name = value.name;
          let label = value.label.replace("LABEL_", "");
          let type = value.type.replace("TYPE_", "");
          if (type === "MESSAGE") type = value.typeName;
          if (label === "REPEATED" && type === value.typeName) {
            let repeatedElement = generateFields(
              props.messageList[type].type.field,
              type,
              path + '/' + name + '@0',
              depth + 1
            );
            elementsArray.push(
              <ul>
                {/* <h3>{messageName}</h3> */}
                <li className="">
                  <button className="setup-button repeated">
                    {label === "REPEATED" ? "+" : ""}
                  </button>
                  <div className="setup-name">{name}</div>
                  <div className="setup-label">{label}</div>
                  <div className="setup-type">{type}</div>
                </li>
                <span style={{ marginLeft: 20 * depth + "px" }}>{repeatedElement}</span>
              </ul>
            );
          } else {
            elementsArray.push(
              <ul>
                {/* <h3>{messageName}</h3> */}
                <li className="first">
                  <button
                    className="setup-button singular"
                    disabled={label === "REPEATED" ? false : true}
                  >
                    {label === "REPEATED" ? "+" : ""}
                  </button>
                  <div className="setup-name">{name}</div>
                  <div className="setup-label">{label}</div>
                  <div className="setup-type">{type}</div>
                  <input onChange={() => handleConfigInput(`${path}/${name}`) } id={`${path}/${name}`} type="text" />
                </li>
              </ul>
            );
          }
        }
      });
      return elementsArray;
    }
  }

  const requestFields = serviceList[selectedService][selectedRequest].requestType.type.field;
  const additionalMessages: JSX.Element[] | JSX.Element = generateFields(
    requestFields,
    serviceList[selectedService][selectedRequest].requestType.type.name
  );

  return (
    <div className="setup">
      <h2>Setup</h2>
      <div className="setup-header">
        <input type="text" placeholder="search for messages" />
      </div>
      <div className="setup-area">{additionalMessages}</div>
    </div>
  );
}
