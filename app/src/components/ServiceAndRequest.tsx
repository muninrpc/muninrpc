import * as React from "react";
import * as _ from "lodash";
import { ServiceOrRequestList } from "./ServiceOrRequestList";
import * as protoLoader from "@grpc/proto-loader";
import { filterObject } from "../utils";

export namespace ServiceAndRequestProps {
  export interface Props {
    serviceList?: { [index: string]: protoLoader.ServiceDefinition };
    messageList: any;
    selectedService?: string;
    selectedRequest?: string;
    handleServiceClick: any;
    handleRequestClick: any;
    handleServiceTrie: any;
    handleRequestTrie: any;
    serviceRecommendations: string[];
    serviceTrieInput: string;
    requestTrieInput: string;
    requestRecommendations: string[];
  }
}

export default function ServiceAndRequest(props: ServiceAndRequestProps.Props, context?: any) {
  const requestListJSX: JSX.Element[] = [];

  // first filter based on service recommendations
  const filteredServices = filterObject(props.serviceList, props.serviceRecommendations, props.serviceTrieInput);
  const requestList = {};
  Object.values(props.serviceList).forEach(serviceObj => {
    Object.keys(serviceObj).forEach(requestName => {
      requestList[requestName] = true;
    });
  });
  const filteredRequests = filterObject(requestList, props.requestRecommendations, props.requestTrieInput);
  const filteredRequestsArray = Object.keys(filteredRequests);

  /*
   * if we did not select a service, display all requests
   * based on available services (filteredServices)
   */
  if (!props.selectedService) {
    Object.entries(filteredServices).forEach(kv => {
      const [service, request] = kv;
      requestListJSX.push(
        <ServiceOrRequestList
          List={Object.keys(request).filter(elem => filteredRequestsArray.includes(elem))}
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
        List={Object.keys(filteredServices[props.selectedService]).filter(elem => filteredRequestsArray.includes(elem))}
        ListType="request"
        onClickHandler={props.handleRequestClick}
        selectedService={props.selectedService}
        selectedRequest={props.selectedRequest}
      />,
    );
  } else {
    requestListJSX.push(
      <ServiceOrRequestList
        List={Object.keys(props.serviceList[props.selectedService]).filter(elem =>
          filteredRequestsArray.includes(elem),
        )}
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
          <input
            type="text"
            placeholder="type a service"
            onChange={e => props.handleServiceTrie(e.target.value)}
            value={props.serviceTrieInput}
          />
        </div>
        <div
          className="service-area"
          onClick={e => {
            //@ts-ignore
            if (e.target.className === "service-area") {
              props.handleServiceClick({ service: "" });
            }
          }}
        >
          <ServiceOrRequestList
            List={Object.keys(filteredServices)}
            onClickHandler={props.handleServiceClick}
            selectedService={props.selectedService}
            ListType="service"
          />
        </div>
      </div>
      <div className="service-request-right">
        <h2>Request</h2>
        <div className="request-header">
          <input
            type="text"
            placeholder="type a request"
            onChange={e => props.handleRequestTrie(e.target.value)}
            value={props.requestTrieInput}
          />
        </div>
        <div className="request-area">{requestListJSX}</div>
      </div>
    </div>
  );
}
