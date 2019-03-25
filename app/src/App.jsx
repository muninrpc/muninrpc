import React, {Component} from 'react'
import Target from './components/Target.jsx';
import Result from './components/Result.jsx';
import ProtoPreview from './components/ProtoPreview.jsx';
import MessageBody from './components/MessageBody.jsx';
import ServiceConfig from './components/ServiceConfig.jsx';

export default class App extends Component {

  constructor() {
    super()
    this.state = {
      inputBox: "",
      items: []
    }
    this.handleDeleteButton = this.handleDeleteButton.bind(this)
    this.handleInputBoxChange = this.handleInputBoxChange.bind(this)
    this.submitItem = this.submitItem.bind(this)
  }

  handleDeleteButton(e) {
    const idx = e.target.name
    this.setState(prevState => (
      {...prevState.items.splice(idx, 1)}
    ))

  }

  handleInputBoxChange(e) {
    this.setState({
      inputBox: e.target.value
    })
  }

  submitItem(){
    let items = [...this.state.items, this.state.inputBox]
    // items.push(this.state.inputBox)
    this.setState({
      inputBox: "",
      items
    })
  }

  render() {
    return (
      <React.Fragment>
        <h1>MuninRPC</h1>
        <div className="app">
          <Target />
          <Result />
          <ProtoPreview />
          <MessageBody />
          <ServiceConfig />
        </div>
      </React.Fragment>
    )

  }
}
