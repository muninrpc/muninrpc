import React, {Component} from 'react'
import {render} from 'react-dom'
import List from './components/List.jsx';
import Buttons from './components/Buttons.jsx';

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
      <div className="app">
          <List items={this.state.items} handleDeleteButton={this.handleDeleteButton}/>
          <Buttons handleInputBoxChange={this.handleInputBoxChange} submitItem={this.submitItem} />
      </div>
    )

  }
}
