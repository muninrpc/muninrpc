import * as React from "react";

export namespace ServiceOrRequestListProps {
  export interface Props {
    List: string[];
    onClickHandler: (a: any) => any;
    selectedService?: string;
    selectedRequest?: string;
    // onClickArg: object;
    ListType: string;
  }
}

export function ServiceOrRequestList(props: ServiceOrRequestListProps.Props) {
  const ListJSX: JSX.Element[] = [];
  props.List.forEach(item => {
    if (props.ListType === "service") {
      ListJSX.push(
        <p
          onClick={() => props.onClickHandler({ service: item })}
          className={props.selectedService === item ? "selected" : ""}
        >
          {item}
        </p>,
      );
    } else if (props.ListType === "request") {
      ListJSX.push(
        <p
          onClick={() => props.onClickHandler({ request: item, service: props.selectedService })}
          className={props.selectedRequest === item ? "selected" : ""}
        >
          {props.selectedService} → {item}
        </p>,
      );
    }
  });

  return <React.Fragment>{ListJSX}</React.Fragment>;
}
