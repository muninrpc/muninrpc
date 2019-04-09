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

  selectedTab: store.main.selectedTab,
  leftArray: store.main.leftArray,
  cleanLeft: store.main.cleanLeft

});

const MapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addNewTab: mainActions.addNewTab,
      removeTab: mainActions.removeTab,
      selectTab: mainActions.selectTab,

      handleProtoUpload: mainActions.handleProtoUpload,
      handleIPInput: mainActions.handleIPInput
    },
    dispatch,
  );

class App extends React.Component<App.Props, {}> {
  constructor(props: App.Props) {
    super(props);

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
