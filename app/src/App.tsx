import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { mainActions } from "./actions";
import { RootState } from "./reducers";
import { MainModel } from "./models";
import { omit } from "./utils";
import { Left, Right, Header } from "./components";

// const MODE_VALUES = (Object.keys(MainModel.Mode) as (keyof typeof MainModel.Mode)[]).map(
//   key => MainModel.Mode[key],
// );

export namespace App {
  export interface Props {
    main: RootState.mainState;
    actions: mainActions;
  }
}

type AppProps = {
  main: RootState.mainState;
  actions: mainActions;
};

const MapStateToProps = store => ({
  responseMetrics: store.main.responseMetrics,
  targetIP: store.main.targetIP,
  filePath: store.main.filePath,
  trail: store.main.trail,
  connectType: store.main.connectType,
  mode: store.main.mode,
  serviceList: store.main.serviceList,
  messageList: store.main.messageList,
  serverResponse: store.main.serverResponse,
  packageDefinition: store.main.packageDefinition,
  selectedService: store.main.selectedService,
  selectedRequest: store.main.selectedRequest,
  serviceTrie: store.main.serviceTrie,
  serviceRecommendations: store.main.serviceRecommendations,
  serviceTrieInput: store.main.serviceTrieInput,
  requestTrie: store.main.requestTrie,
  messageTrie: store.main.messageTrie,
  messageRecommendations: store.main.messageRecommendations,
  messageTrieInput: store.main.messageTrieInput,
  configArguments: store.main.configArguments,
  configElements: store.main.configElements,
  requestConfig: store.main.requestConfig,
  baseConfig: store.main.baseConfig,
});

const MapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleIPInput: mainActions.handleIPInput,
      handleConfigInput: mainActions.handleConfigInput,
      handleProtoUpload: mainActions.handleProtoUpload,
      handleServiceClick: mainActions.handleServiceClick,
      handleRequestClick: mainActions.handleRequestClick,
      handleRepeatedClick: mainActions.handleRepeatedClick,
      handleSendRequest: mainActions.handleSendRequest,
      setMode: mainActions.setMode,
      handleServiceTrie: mainActions.handleServiceTrie,
      handleMessageTrie: mainActions.handleMessageTrie,
    },
    dispatch,
  );

class App extends React.Component<App.Props, {}> {
  constructor(props: App.Props) {
    super(props);
  }
  render() {
    return (
      <div className="wrapper">
        <Header {...this.props} />
        <div className="app">
          <Left {...this.props} />
          <Right {...this.props} />
        </div>
      </div>
    );
  }
}

//export a connected version of <App/>
export default connect(
  MapStateToProps,
  MapDispatchToProps,
)(App);
