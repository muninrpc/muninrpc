import React from 'react'

const List = (props) => {
 let itemsJSX = [];
  props.items.forEach( (li, idx) => {
    itemsJSX.push(
      <div key={idx}>
        <li>
          {li}
          <button name={idx} onClick={props.handleDeleteButton}>X</button>
        </li>
      </div>
    )
  })
  return (
    <div>
      <ol>
        {itemsJSX}
      </ol>
    </div>
  )
}

export default List;