import * as React from 'react';
import { element } from 'prop-types';

export namespace SetupProps {
  export interface Props {
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
  }
}

export default function Setup(props:  SetupProps.Props, context?: any) {
  let { serviceList, selectedService, selectedRequest } = props;

  function generateFields(field, messageName){
    if (field.length === 0) {
      return (<p>This message has no fields.</p>)
    } else {
      let elementsArray = [];
      elementsArray.push()
      field.forEach( value => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          let name = value.name;
          let label = value.label.replace('LABEL_', '');
          let type = value.type.replace('TYPE_', '');
          if (type === "MESSAGE") type = value.typeName;
          if (label === "REPEATED" && type === value.typeName) {
            let repeatedElement = generateFields(props.messageList[type].type.field, type)
            elementsArray.push(
              <ul>
                <h3>{messageName}</h3>
                <li className="first">
                  <button className="setup-button">{label === 'REPEATED' ? '+' : ''}</button>
                  <div className="setup-name">{name }</div>
                  <div className="setup-label">{label }</div>
                  <div className="setup-type">{type }</div>
                  
                </li>
                <div>
                    {repeatedElement}
                  </div>
              </ul>
            )
          } else {
            elementsArray.push(
              <ul>
                <h3>{messageName}</h3>
                <li className="first">
                  <button className="setup-button">{label === 'REPEATED' ? '+' : ''}</button>
                  <div className="setup-name">{name}</div>
                  <div className="setup-label">{label}</div>
                  <div className="setup-type">{type}</div>
                  <input type="text"></input>
                </li>
              </ul>
            )
          }
        }
      })
      return elementsArray;
    }
  }

  let requestFields = serviceList[selectedService][selectedRequest].requestType.type.field;
  let additionalMessages: JSX.Element[] = generateFields(requestFields, serviceList[selectedService][selectedRequest].requestType.type.name);
  console.log('requestFields:', requestFields)
      
  return (
  <div className="setup">
    <h2>Setup</h2>
      <div className="setup-header">
        <input type="text" placeholder="search for messages" />
      </div>
      <div className="setup-area" >
        {additionalMessages}
      </div>
  </div>
  )
}
