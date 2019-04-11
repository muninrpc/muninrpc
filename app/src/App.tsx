import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { mainActions } from "./actions";
import { RootState } from "./reducers";
import { MainModel } from "./models";
import { omit } from "./utils";
import { Right, Header } from "./components";

import * as Types from "MyTypes";
import { mainActions } from "./actions";
import { RootState } from "./models";


// const MODE_VALUES = (Object.keys(MainModel.Mode) as (keyof typeof MainModel.Mode)[]).map(
//   key => MainModel.Mode[key],
// );

type AppProps = {
  main: RootState;
  actions: mainActions;
};

// import components
import { Left, Right, Header } from "./components";

type AppProps = RootState & mainActions;


const MapStateToProps = store => ({
  selectedTab: store.main.selectedTab,
  leftArray: store.main.leftArray,
  activeTab: store.main.activeTab,
  serverResponses: store.main.serverResponses,
  handlers: store.main.handlers,
  isStreaming: store.main.isStreaming

});

const MapDispatchToProps = (dispatch: Dispatch<RootAction>) => bindActionCreators(mainActions, dispatch);

class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);
    this.props.addNewTab(this.props.getTabState);
  }

  componentDidMount() {
    
  }

  render() {
    let selectedIdx;
    this.props.leftArray.forEach((ele, idx) => {
      if (ele.key === this.props.selectedTab) {
        selectedIdx = idx;
      }
    });

    return (
      <div className="wrapper">
        <Header {...this.props} getTabState={this.props.getTabState} toggleStream={this.props.toggleStream} />
        <div className="app">
          <div className="left-half">{this.props.leftArray[selectedIdx]}</div>
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
