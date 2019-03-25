import React from 'react'

const Buttons = (props) =>  (
  <div>
    <input id="listInput" type="text" placeholder="add new to-do" onChange={props.handleInputBoxChange}></input> 
    <button onClick={() => {document.getElementById('listInput').value = ''; props.submitItem()}}>Submit Item</button>
    <button>Get List</button>
    <button>Start Server</button>
  </div>
)

export default Buttons;
