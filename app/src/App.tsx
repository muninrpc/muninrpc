import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
// import { RouteComponentProps } from 'react-router';
import { mainActions } from './actions';
import { RootState } from './reducers';
import { MainModel } from './models';
import { omit } from './utils';
import Left from './components/Left';
import Right from './components/Right';
import Header from './components/Header'

const MODE_VALUES = (Object.keys(
  MainModel.Mode
) as (keyof typeof MainModel.Mode)[]).map(key => MainModel.Mode[key]);

export namespace App {
  export interface Props {
    main: RootState.mainState;
    actions: mainActions;
    mode: MainModel.Mode;
  }
}

@connect(
  (state: RootState, ownProps): Pick<App.Props, 'main' | 'mode'> => {
    const hash = ownProps.location && ownProps.location.hash.replace('#', ''); // ???
    const mode =
      MODE_VALUES.find(value => value === hash) || MainModel.Mode.SHOW_SERVICE;
    return { main: state.main, mode };
  },
  (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators(omit(mainActions, 'Type'), dispatch)
  })
)
export default class App extends React.Component<App.Props, {}> {
  constructor(props: any) {
    super(props);
    console.log('this.props:', this.props);
    console.log('MODE_VALUES are...', MODE_VALUES);
  }
  render() {
    const { targetIP, filePath, mode, serviceList, requestList, serverResponse, responseMetrics } = this.props.main;
    const { handleIPInput, handleProtoUpload, setMode } = this.props.actions;
    return (
      <div className="wrapper">
        <Header />
        <div className="app">
          <Left serviceList={serviceList} requestList={requestList} setMode={setMode} mode={mode} targetIP={targetIP} filePath={filePath} handleIPInput={handleIPInput} handleProtoUpload={handleProtoUpload}/>
          <Right serverResponse={serverResponse} responseMetrics={responseMetrics}/>
        </div>
      </div>
    );
  }
}
