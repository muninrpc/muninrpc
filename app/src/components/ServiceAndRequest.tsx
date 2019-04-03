import * as React from "react";
import * as _ from "lodash";
import { ServiceOrRequestList } from "./ServiceOrRequestList";
import { filterObject } from "../utils";

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
  const requestListJSX: JSX.Element[] = [];

  // first filter based on service recommendations
  const filteredServices = filterObject(props.serviceList, props.serviceRecommendations);

  /*
   * if we did not select a service, display all requests
   * based on available services (filteredServices)
   */
  if (!props.selectedService) {
    Object.entries(filteredServices).forEach(kv => {
      const [service, request] = kv;
      requestListJSX.push(
        <ServiceOrRequestList
          List={Object.keys(request)}
          ListType="request"
          onClickHandler={props.handleRequestClick}
          selectedService={service} //??
          selectedRequest={props.selectedRequest}
        />,
      );
    });
  } else if (Object.hasOwnProperty.call(filteredServices, props.selectedService)) {
    /*
     * if we did select a service, show the available requests for that particular service
     */
    requestListJSX.push(
      <ServiceOrRequestList
        List={Object.keys(filteredServices[props.selectedService])}
        ListType="request"
        onClickHandler={props.handleRequestClick}
        selectedService={props.selectedService}
        selectedRequest={props.selectedRequest}
      />,
    );
  } else {
    requestListJSX.push(
      <ServiceOrRequestList
        List={Object.keys(props.serviceList[props.selectedService])}
        ListType="request"
        onClickHandler={props.handleRequestClick}
        selectedService={props.selectedService}
        selectedRequest={props.selectedRequest}
      />,
    );
  }

  return (
    <div className="service-request">
      <div className="service-request-left">
        <h2>Service</h2>
        <div className="service-header">
          <img src="rune" />
          <input
            type="text"
            placeholder="type a service"
            onChange={e => props.handleServiceTrie(e.target.value)}
          />
        </div>
        <div
          className="service-area"
          onClick={e => {
            if (e.target.className === "service-area") {
              props.handleServiceClick({ service: "" });
            }
          }}
        >
          <ServiceOrRequestList
            List={Object.keys(filteredServices)}
            onClickHandler={props.handleServiceClick}
            selectedService={props.selectedService}
            ListType={"service"}
          />
        </div>
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
