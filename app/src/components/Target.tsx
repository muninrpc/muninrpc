import * as React from 'react';

export function Target(props) {
  return (
    <div id="Target">
      <p>Target Server IP</p>
      <input type="text" placeholder="Enter request URL" />
      <p>Upload .proto file</p>
      <input type="file" onChange={props.handleFileChosen} />
    </div>
  );
}
