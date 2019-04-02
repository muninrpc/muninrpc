import * as React from "react";

export namespace ServiceAndRequestProps {
  export interface Props {
    serviceList?: string[];
    messageList: any;
    selectedService?: string;
    selectedRequest?: string;
    handleServiceClick: any;
    handleRequestClick: any;
  }
}

export default function ServiceAndRequest(props: ServiceAndRequestProps.Props, context?: any) {
  const serviceList = [];
  const requestList = [];
  Object.keys(props.serviceList).forEach((service, idx) => {
    serviceList.push(
      <p
        key={"servItem" + idx}
        onClick={() => props.handleServiceClick({ service })}
        className={props.selectedService === service ? "selected" : ""}
      >
        {service}
      </p>
    );
    Object.keys(props.serviceList[service]).forEach((request, idx2) => {
      requestList.push(
        <p
          key={"reqItem" + idx2}
          onClick={() => props.handleRequestClick({ request, service })}
          className={props.selectedRequest === request ? "selected" : ""}
        >
          {service} → {request}
        </p>
      );
    });
  });
  return (
    <div className="service-request">
      <div className="service-request-left">
        <h2>Service</h2>
        <div className="service-header">
          <img src="rune" />
          <input type="text" placeholder="type a service" />
        </div>
        <div className="service-area">{serviceList}</div>
      </div>
      <div className="service-request-right">
        <h2>Request</h2>
        <div className="request-header">
          <input type="text" placeholder="type a request" />
        </div>
        <div className="request-area">{requestList}</div>
      </div>
    </div>
  );
}

// flexbox row: div with rune and searchbar
// flexbox col: renders services array. each element in array will be a p tag
