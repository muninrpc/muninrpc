import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import * as Types from "MyTypes";
import { mainActions } from "./actions";
import { RootState } from "./models";

// import components
import { Left, Right, Header } from "./components";

type AppProps = RootState & mainActions;

const MapStateToProps = (store: Types.ReducerState) => ({
  responseMetrics: store.main.responseMetrics,
  filePath: store.main.filePath,
  mode: store.main.mode,
  serviceList: store.main.serviceList,
  messageList: store.main.messageList,
  serverResponse: store.main.serverResponse,
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

const MapDispatchToProps = (dispatch: Dispatch<Types.RootAction>) =>
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
    //@ts-ignore
    dispatch,
  );

class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
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
