import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { mainActions } from "./actions";
import { RootState } from "./models";
import { Left, Right, Header } from "./components";
import { RootAction, ReducerState } from "MyTypes";


// const MODE_VALUES = (Object.keys(MainModel.Mode) as (keyof typeof MainModel.Mode)[]).map(
//   key => MainModel.Mode[key],
// );

type AppProps = {
  main: RootState;
  actions: mainActions;
};

const MapStateToProps = store => ({

  selectedTab: store.main.selectedTab,
  leftArray: store.main.leftArray,
  cleanLeft: store.main.cleanLeft

});

const MapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      addNewTab: mainActions.addNewTab,
      removeTab: mainActions.removeTab,
      selectTab: mainActions.selectTab,
    },
    dispatch,
  );

class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props);
    this.props.addNewTab();
    //initialize with a fresh tab?
  }
  render() {
    let selectedIdx;
    this.props.leftArray.forEach( (ele, idx) => {
      if(ele.key === this.props.selectedTab) {
        selectedIdx = idx;
      }
    })

    return (
      <div className="wrapper">
        <Header {...this.props} />
        <div className="app">
          <div className="left">
            {this.props.leftArray[selectedIdx]}
          </div>
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
