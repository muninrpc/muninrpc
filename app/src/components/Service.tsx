import * as React from 'react';

export namespace ServiceProps {
  export interface Props {
    serviceList?: string[];
    requestList?: string[];
  }
}

export default function Service(props: ServiceProps.Props, context?: any) {
  const serviceList = [];
  const requestList = [];
  if(props.serviceList) {
    props.serviceList.forEach( (service, idx) => {
      serviceList.push(
        <p key={"servItem" + idx}>{service}</p>
      )
    })
  }
  if(props.requestList) {
    props.requestList.forEach( (request, idx) => {
      requestList.push(
        <p key={"reqItem" + idx}>{request}</p>
      )
    })
  }
  return (
    <div className="service-request">
      <div className="left">
        <h2>Service</h2>
        <div className="service-header">
          <img src="rune" />
          <input type="text" placeholder="type a service" />
        </div>
        <div className="service-area" >
          {serviceList}
        </div>
      </div>
      <div className="right">
        <h2>Request</h2>
        <div className="request-header">
          <input type="text" placeholder="type a request" />
        </div>
        <div className="request-area">
        {requestList}
        </div>
      </div>
    </div>
  );
}


// flexbox row: div with rune and searchbar
// flexbox col: renders services array. each element in array will be a p tag