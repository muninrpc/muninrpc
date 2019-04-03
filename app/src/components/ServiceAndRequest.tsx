import * as React from "react";

export namespace ServiceAndRequestProps {
  export interface Props {
    serviceList?: string[];
    messageList: any;
    selectedService?: string;
    selectedRequest?: string;
    handleServiceClick: any;
    handleRequestClick: any;
    handleServiceTrie: any;
    serviceRecommendations: string[];
    serviceTrieInput: string;
  }
}

export default function ServiceAndRequest(props: ServiceAndRequestProps.Props, context?: any) {
  //console.log('props of ServiceAndRequest', props)
  const serviceListJSX: JSX.Element[] = [];
  const requestListJSX: JSX.Element[] = [];
  Object.keys(props.serviceList).filter(servicename => {
    if (props.serviceRecommendations.length === 0) { 
      if (props.serviceTrieInput === "") {
        return true;
      } else return false;
    } else {
      if (props.serviceRecommendations.includes(servicename)) {
        return true;
      } else return false;
    }
  }).forEach((service, idx) => {
    serviceListJSX.push(
      <p
        key={"servItem" + idx}
        onClick={() => props.handleServiceClick({ service })}
        className={props.selectedService === service ? "selected" : ""}
      >
        {service}
      </p>
    );
      if (service === props.selectedService) {
        Object.keys(props.serviceList[props.selectedService]).forEach((request, idx2) => {
          requestListJSX.push(
            <p
              key={"reqItem" + idx + idx2}
              onClick={() => props.handleRequestClick({ request, service })}
              className={props.selectedRequest === request ? "selected" : ""}
            >
              {service} → {request}
            </p>
          );
        });
      } else if (!props.selectedService) {
        Object.keys(props.serviceList[service]).forEach((request, idx2) => {
          requestListJSX.push(
            <p
              key={"reqItem" + idx + idx2}
              onClick={() => props.handleRequestClick({ request, service })}
              className={props.selectedRequest === request ? "selected" : ""}
            >
              {service} → {request}
            </p>
          );
        });
  }});

  return (
    <div className="service-request">
      <div className="service-request-left">
        <h2>Service</h2>
        <div className="service-header">
          <img src="rune" />
          <input type="text" placeholder="type a service" onChange={(e) => props.handleServiceTrie(e.target.value)}/>
        </div>
        <div className="service-area" onClick={(e) => {
          if (e.target.className === 'service-area') {
            props.handleServiceClick({ service: ""})
          }
          }}>{serviceListJSX}</div>
      </div>
      <div className="service-request-right">
        <h2>Request</h2>
        <div className="request-header">
          <input type="text" placeholder="type a request" />
        </div>
        <div className="request-area">{requestListJSX}</div>
      </div>
    </div>
  );
}

// flexbox row: div with rune and searchbar
// flexbox col: renders services array. each element in array will be a p tag
