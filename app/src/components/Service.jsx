import React from 'react'

export default function Service() {
  return (
    <div className="service">
      <div className="tabs">
        <button className="service-button">Service</button>
        <button className="request-button">Request</button>
        <button className="req-setup-button">Request Setup</button>
      </div>
      <div className="search-bar">
        <img src="rune" />
        <input type="text" placeholder="type a service" />
      </div>
      <div className="search-area"></div>
    </div>
  )
}