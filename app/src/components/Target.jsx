import React, { useState } from 'react';

export default function TargetUpload() {
  return (
    <div id="Target">
      <p>Target Server IP</p>
      <input type="text" placeholder="Enter request URL"></input>
      <p>Upload .proto file</p>
      <textarea></textarea>
      <button>Upload</button>
    </div>
  )
}
