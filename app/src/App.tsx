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

// import components
import { Left, Right, Header } from "./components";

type AppProps = RootState & mainActions;

const MapStateToProps = store => ({
  selectedTab: store.main.selectedTab,
  leftArray: store.main.leftArray,
  activeTab: store.main.activeTab,
});

const MapDispatchToProps = (dispatch: Dispatch<Types.RootAction>) =>
  bindActionCreators(
    {
      getTabState: mainActions.getTabState,
      addNewTab: mainActions.addNewTab,
      removeTab: mainActions.removeTab,
      selectTab: mainActions.selectTab,
    },
    //@ts-ignore
    dispatch,
  );

class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);
  }

  componentDidMount() {
    this.props.addNewTab(this.props.getTabState);
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
        <Header {...this.props} getTabState={this.props.getTabState} />
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
