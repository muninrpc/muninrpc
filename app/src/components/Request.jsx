import React from 'react'

export default function Request() {
  return (
    <div className="request">
      <div className="service">
        <div className="tabs"></div>
        <div className="search-bar">
          <img src="rune" />
          <input type="text" placeholder="type a service" />
          <div className="rpc-return"></div>
        </div>
        <div className="search-area"></div>
      </div>
    </div>
  )
}