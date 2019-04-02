import * as React from "react";
import { element } from "prop-types";

export namespace SetupProps {
  export interface Props {
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
  }
}

export default function Setup(props: SetupProps.Props, context?: any) {
  const { serviceList, selectedService, selectedRequest } = props;

  function generateFields(field, messageName, depth = 1) {
    if (field.length === 0) {
      return <p className="no-fields">This message has no fields.</p>;
    } else {
      const elementsArray: JSX.Element[] = [];
      elementsArray.push(<h2>{messageName}</h2>);
      field.forEach(value => {
        if (typeof value === "object" && !Array.isArray(value)) {
          const name = value.name;
          const label = value.label.replace("LABEL_", "");
          let type = value.type.replace("TYPE_", "");
          if (type === "MESSAGE") {
            type = value.typeName;
          }
          if (label === "REPEATED" && type === value.typeName) {
            const repeatedElement = generateFields(
              props.messageList[type].type.field,
              type,
              depth + 1
            );
            elementsArray.push(
              <ul>
                <li className="first">
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
                  <input type="text" />
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
  const additionalMessages = generateFields(
    requestFields,
    serviceList[selectedService][selectedRequest].requestType.type.name
  );
  console.log("requestFields:", requestFields);

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
