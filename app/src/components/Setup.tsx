import * as React from "react";
import { element } from "prop-types";
import { JSXSpreadChild } from "@babel/types";
import { request } from "http";

export namespace SetupProps {
  export interface Props {
    serviceList: string[];
    messageList: any;
    selectedService: string;
    selectedRequest: string;
    
    configElements: any;
    configArguments: any;

    handleRepeatedClick: any;
    handleConfigInput: any;
  }
}

export default function Setup(props: SetupProps.Props, context?: any) {
  let { handleConfigInput, handleRepeatedClick, serviceList, selectedService, selectedRequest } = props;

  function generateFields(cfgArgs: any, cfgEle:any, depth = 0, path = ''): JSX.Element[] | JSX.Element  {
    // logic for constructing elements

    if(cfgArgs) {
      if ( (Object.keys(cfgArgs).length === 0) || (cfgArgs.length === 0) ) {
        // additionalMessages.push(<p className="no-fields">This message has no fields.</p>);
      } else {
        Object.keys(cfgArgs).forEach( field => {
          // case: is repeating
          if( Array.isArray(cfgEle[field]) ) {
            // is a repeating message
            if( cfgEle[field][0].type === 'TYPE_MESSAGE') {
              let pos = additionalMessages.length;
              cfgArgs[field].forEach( (ele, idx) => {
                additionalMessages.push(
                  <li style={ {marginLeft: (depth-1) * 20 + 'px'} }>
                    <button onClick={ (e) => handleRepeatedClick({ id: path + '.' + field, value: e.target.value }) }>
                      +
                    </button>
                    {cfgEle[field][0].messageName}:{field} {cfgEle[field][0].type} {cfgEle[field][0].label} 
                  </li>
                )
                generateFields(cfgArgs[field][idx], cfgEle[field][0], depth+1, path+'.'+field+'@'+idx)
              })
            } 
          // case: is non-repeating
          } else {
            // is a non-repeating message
            if( cfgEle[field].type === 'TYPE_MESSAGE') {
              let pos = additionalMessages.length;
              additionalMessages.push(
                <li style={ {marginLeft: (depth) * 20 + 'px'} }>
                  {cfgEle[field].typeName}: {field} {cfgEle[field].type} {cfgEle[field].label} 
                </li>
              )  
            generateFields(cfgArgs[field], cfgEle[field], depth+1, path+'.'+field)
            // is a repeating non-message
            } else if(cfgEle[field].label === 'LABEL_REPEATED') {
              let pos = additionalMessages.length;
              cfgArgs[field].forEach( (ele, idx) => {
                additionalMessages.push(
                  <li style={ {marginLeft: (depth-1) * 20 + 'px'} }>
                    <button>+</button>
                    {field} {cfgEle[field].type} {cfgEle[field].label} 
                    <input id={path + '.' + field} className={pos} onChange={(e) => handleConfigInput({id: path+'.'+field+'@'+idx, value: e.target.value}) }/>
                  </li>
                )
              })  
            // is a non-repeating non-message
            } else {
              let pos = additionalMessages.length;
              additionalMessages.push(
                <li style={ {marginLeft: (depth) * 20 + 'px'} }>
                  {field} {cfgEle[field].type} {cfgEle[field].label} 
                  <input id={path + '.' + field} className={pos} onChange={(e) => handleConfigInput({id: path+'.'+field , value: e.target.value}) }/>
                </li>
              )
            }
          }
        })
      }
    }
  }

  const additionalMessages: JSX.Element[] | JSX.Element = [] = []
  generateFields(props.configArguments.arguments, props.configElements.arguments);

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
