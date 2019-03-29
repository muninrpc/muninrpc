import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'react-redux';
import App from './App';
require('./styles/main.scss');
import { configureStore } from '../src/store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
