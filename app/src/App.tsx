import * as React from 'react';
import Left from './components/Left';
import Right from './components/Right';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputBox: '',
      items: []
    };
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
