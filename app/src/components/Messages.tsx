import * as React from 'react';

export namespace MessageProps {
  export interface Props {
    messageList: any
  }
}


export default function Messages(props: MessageProps.Props, context?: any) {
  let messageArray: JSX.Element[] = [];
  // React.useEffect(() => {
  console.log('props:', props)
  if (props.messageList) {
    Object.keys(props.messageList).forEach( (name, nameidx) => {
      let type: string = '';
      let label: string = '';
      if(props.messageList[name].type.field.length === 0) {
        type = 'This message has no fields.'
      } else {
        props.messageList[name].type.field.forEach( field => {
          label = field.label.replace('LABEL_', '');
          type = field.type.replace('TYPE_', '');
          if(type === 'MESSAGE') type += ': ' + field.typeName
        })
      }
      
      console.log('name:', name)
      if(label === '') {
        messageArray.push(
          <p key={nameidx}>
            <span className='message-name'>{name}</span> 
            <span className='message-type'>{type}</span>
          </p>
        )
      } else {
        messageArray.push(
          <p key={nameidx}>
            <span className='message-name'>{name}</span> 
            <span className='message-label'>{label}</span> 
            <span className='message-type'>{type}</span>
          </p>
        )
      }
    )
  }
  // })
  
  console.log('messageArray', messageArray)

  return (
    <div className="messages">
      <h2>Messages</h2>
      <div className="message-header">
        <input type="text" placeholder="search for messages" />
      </div>
      <div className="message-area" >
          {messageArray}
      </div>
    </div>
  );
}
