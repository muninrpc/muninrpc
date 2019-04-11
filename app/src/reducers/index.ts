import { combineReducers } from "redux";
import { mainReducer } from "./main";

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4

const rootReducer = combineReducers({
  main: mainReducer,
});

export default rootReducer;
