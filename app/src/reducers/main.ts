import { RootState } from "./state";
import { mainActions } from "../actions";
import { MainModel } from "../models/MainModel";
import * as pbActions from "../../lib/local/pbActions";
import {
  CallType,
  BaseConfig,
  RequestConfig,
  UnaryRequestBody,
  GrpcHandlerFactory,
} from "../../lib/local/grpcHandlerFactory";
import { Trie } from "../utils/trieClass";
import * as cloneDeep from "lodash.clonedeep";
import { Test } from '../components/Test';


const initialState: RootState.mainState = {

  selectedTab: 0,
  leftArray: [],
  cleanLeft: {}

};

export function TestFactory(props) {
  return Test({
    index: props.index,
    removeTab: props.removeTab
  })
}

export const mainReducer = (state = initialState, action) => {
  switch (action.type) {

    case mainActions.Type.ADD_NEW_TAB : {
      const newLeftArray = cloneDeep(state.leftArray)
      newLeftArray.push( TestFactory({ pasta: Math.floor(Math.random() * 10), index: state.leftArray.length, removeTab: action.payload.removeFunc }) )
      return ({
        ...state,
        leftArray: newLeftArray
      })
    }

    case mainActions.Type.REMOVE_TAB : {

      console.log('this is the supposed id:', action.payload)

      const newLeftArray = cloneDeep(state.leftArray);
      for(let i=action.payload; i<newLeftArray.length-1; i++) {
        newLeftArray[i] = newLeftArray[i+1];
      } 
      newLeftArray.pop();


      return {
        ...state,
        leftArray: newLeftArray
      }
    }


    default: {
      return state;
    }
  };
}
