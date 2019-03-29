import * as React from 'react';
import { Left, Right } from './components';

// import protobuf and grpc functions
import { loadProtoFile, parsePackageDefinition } from '../lib/local/pbActions';

interface AppState {
  protoPath: string;
  protoServices: any;
  protoMessages: any;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      protoPath: ''
    };
  }

  /**
   * remove below once redux implemented
   */

  handleFileChosen(e) {
    const file = e.target.files[0];
    if (file) {
      console.log(file.path);
      this.setState({ protoPath: file.path }, () => {
        const pkgDefn = loadProtoFile(this.state.protoPath);
        //@ts-ignore
        const { svcs, msgs } = parsePackageDefinition(pkgDefn);
        this.setState({
          protoServices: svcs,
          protoMessages: msgs
        });
      });
    } else {
      throw new Error('incorrect file path');
    }
  }

  render() {
    return (
      <div className="app">
        <Left />
        <Right />
      </div>
    );
  }
}
