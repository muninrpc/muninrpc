import { combineReducers } from "redux";
import { RootState } from "./state";
import { mainReducer } from "./main";

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4

type CombinedReducerState = {
  readonly main: RootState;
};

const rootReducer = combineReducers({
  main: mainReducer,
});

export default rootReducer;
