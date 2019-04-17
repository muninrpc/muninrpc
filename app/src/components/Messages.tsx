import * as React from "react";
import { filterObject } from "../utils";

export namespace MessageProps {
  export interface Props {
    messageList: any;
    handleMessageTrie: any;
    messageTrieInput: string;
    messageRecommendations: string[];
  }
}

export default function Messages(props: MessageProps.Props) {
  const messageArray: JSX.Element[] = [];

  const filteredMessageList = filterObject(props.messageList, props.messageRecommendations, props.messageTrieInput);
  //console.log('filteredMessageList', filteredMessageList)

  if (filteredMessageList) {
    Object.keys(filteredMessageList).forEach((name, nameidx) => {
      let type: string = "";
      let label: string = "";
      if (filteredMessageList[name].type.field.length === 0) {
        type = "This message has no fields.";
      } else {
        filteredMessageList[name].type.field.forEach(field => {
          label = field.label.replace("LABEL_", "");
          type = field.type.replace("TYPE_", "");
          if (type === "MESSAGE") {
            type += ": " + field.typeName;
          }
        });
      }

      if (label === "") {
        messageArray.push(
          <p key={nameidx}>
            <span className="message-name">{name}</span>
            <span className="message-type">{type}</span>
          </p>,
        );
      } else {
        messageArray.push(
          <p key={nameidx}>
            <span className="message-name">{name}</span>
            <span className="message-label">{label}</span>
            <span className="message-type">{type}</span>
          </p>,
        );
      }
    });
  }

  return (
    <div className="messages">
      <h2>Messages</h2>
      <div className="message-header">
        <input type="text" placeholder="search for messages" onChange={e => props.handleMessageTrie(e.target.value)} />
      </div>
      <div className="message-area">{messageArray}</div>
    </div>
  );
}
