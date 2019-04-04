import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "../src/store";
require("./styles/main.scss");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app"),
);
