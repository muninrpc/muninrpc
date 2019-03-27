import React, { Component } from 'react';
import Target from './components/Target.jsx';
import Result from './components/Result.jsx';
import ProtoPreview from './components/ProtoPreview.jsx';
import MessageBody from './components/MessageBody.jsx';
import ServiceConfig from './components/ServiceConfig.jsx';

// import protobuf and grpc functions
import { loadProtoFile, parsePackageDefinition } from '../lib/local/pbActions';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      inputBox: '',
      items: [],
      protoServices: {},
      protoMessages: {},
      requestConfig: {
        protoPath: '',
        grpcURI: '',
        package: '',
        service: '',
        request: ''
      }
    };
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
    this.handleInputBoxChange = this.handleInputBoxChange.bind(this);
    this.submitItem = this.submitItem.bind(this);
    this.handleFileChosen = this.handleFileChosen.bind(this);
  }

  handleFileChosen(e) {
    const file = e.target.files[0];
    if (file) {
      console.log(file.path);
      this.setState({ protoPath: file.path }, () => {
        const pkgDefn = loadProtoFile(this.state.protoPath);
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

  handleDeleteButton(e) {
    const idx = e.target.name;
    this.setState(prevState => ({ ...prevState.items.splice(idx, 1) }));
  }

  handleInputBoxChange(e) {
    this.setState({
      inputBox: e.target.value
    });
  }

  submitItem() {
    let items = [...this.state.items, this.state.inputBox];
    // items.push(this.state.inputBox)
    this.setState({
      inputBox: '',
      items
    });
  }

  startServer() {
    const { fork } = require('child_process');
    const ps = fork(`${__dirname}/server.js`);
  }

  render() {
    return (
      <React.Fragment>
        <h1>MuninRPC</h1>
        <div className="app">
          <Target handleFileChosen={this.handleFileChosen} />
          <Result />
          <ProtoPreview />
          <MessageBody />
          <ServiceConfig />
        </div>
      </React.Fragment>
    );
  }
}
