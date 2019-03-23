import React from 'react'

const Buttons = (props) =>  (
  <div>
    <input id="listInput" type="text" placeholder="add new to-do" onChange={props.handleInputBoxChange}></input> 
    <button onClick={() => {document.getElementById('listInput').value = ''; props.submitItem()}}>Submit</button>
  </div>
)

export default Buttons;
