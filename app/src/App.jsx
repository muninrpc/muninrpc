import React, {Component} from 'react'
import Left from './components/Left.jsx';
import Right from './components/Right.jsx';
const grpc = require('grpc')
export default class App extends Component {

  constructor() {
    super()
    this.state = {
      inputBox: "",
      items: []
    }

  }

  render() {
    return (
      <div className="app">
        <Left />
        <Right />
      </div>
    )

  }
}
