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

  function createListItem(name, label, type, depth) {

  }

  function generateFields(cfgArgs: any, cfgEle:any, depth = 0, path = ''): JSX.Element[] | JSX.Element  {
    // logic for constructing elements

    if(cfgArgs) {
      if ( (Object.keys(cfgArgs).length === 0) || (cfgArgs.length === 0) ) {
        // additionalMessages.push(<p className="no-fields">This message has no fields.</p>);
      } else {
        // repeated field & message
        if(Array.isArray(cfgArgs) && (cfgArgs[0] !== null) ) {
          cfgArgs.forEach( (field, idx) => {
            additionalMessages.push(
            <li style={ {marginLeft: (depth-1) * 20 + 'px'} }>
              <button>+</button>
              {cfgEle[0].typeName} - {cfgEle[0].messageName} {cfgEle[0].type} {cfgEle[0].label} 
            </li>)
            if(typeof field === 'object') generateFields(field, cfgEle[0], depth + 1, path + '@' + idx)    
          })
        // repeated field & not a message
        } else if (Array.isArray(cfgArgs)) {
          console.log(cfgEle)
          cfgArgs.forEach( (field, idx) => {
            additionalMessages.push(
            <li style={ {marginLeft: (depth-1) * 20 + 'px'} }>
              <button>+</button>
              {cfgEle.name} {cfgEle.type} {cfgEle.label} 
              <input id={path + '.' + cfgEle.name} onChange={(e) => handleConfigInput({ id: path + '.' + cfgEle.name + '@' + idx, value: e.target.value}) }/>
            </li>)
            if(typeof field === 'object') generateFields(field, cfgEle[0], depth + 1, path + '@' + idx)    
          }) 
        } else {
          Object.keys(cfgArgs).forEach( field => {
            // and a message
            if( cfgEle[field].type === 'TYPE_MESSAGE' ) {
              additionalMessages.push(
                <li style={ {marginLeft: depth * 20 + 'px'} }>
                  {cfgEle[field].typeName} - {cfgEle[field].name} {cfgEle[field].type} {cfgEle[field].label} 
                </li>
              )
            // not a message
            } else {
              let pos = additionalMessages.length;
              if(cfgEle[field].label === 'LABEL_REPEATED') {
                // additionalMessages.push(
                //   <li style={ {marginLeft: (depth-1) * 20 + 'px'} }>
                //     <button onClick={ () => handleRepeatedClick({ id: path + '.' + field, value: e.target.value }) }>
                //       +
                //     </button>
                //     {field} {cfgEle[field].type} {cfgEle[field].label} 
                //     <input id={path + '.' + field} className={pos} onChange={(e) => handleConfigInput({ id: path + '.' + field, value: e.target.value}) }/>
                //   </li>
                // )
              } else {
                additionalMessages.push(
                  <li style={ {marginLeft: depth * 20 + 'px'} }>
                    {field} {cfgEle[field].type} {cfgEle[field].label} 
                    <input id={path + '.' + field} className={pos} onChange={(e) => handleConfigInput({ id: path + '.' + field, value: e.target.value}) }/>
                  </li>
                )
              }
            }  
            if(typeof cfgArgs[field] === 'object') generateFields(cfgArgs[field], cfgEle[field], depth + 1, path + '.' + field)
          })
        }
      } 
    }
  }

  const additionalMessages: JSX.Element[] | JSX.Element = [] = []
  generateFields(props.configArguments.arguments, props.configElements.arguments);

  // console.log('FINAL', additionalMessages)

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
