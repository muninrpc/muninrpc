import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { mainActions } from '../actions';
import { MainModel } from '../models/MainModel';

const initialState: RootState.mainState = 
  {
    responseMetrics: 'got2go fast',
    targetIP: '',
    filePath: '',
    trail: 'eggplant',
    connectType: 'lol',
    mode: 'service',
    serviceList: ['testService'],
    requestList: ['testRequest'],
    serverResponse: ['response from server will go here']
  }
;

export const mainReducer = handleActions<RootState.mainState, MainModel>(
  {
    [mainActions.Type.HANDLE_IP_INPUT]: (state, action) => (
      {
        ...state,
        targetIP: action.payload
      }
    ),
    [mainActions.Type.HANDLE_PROTO_UPLOAD]: (state, action) => (
      {
        ...state,
        filePath: action.payload[0].path,
      }
    ),
    [mainActions.Type.HANDLE_SET_MODE]: (state, action) => (
      {
        ...state,
        mode: action.payload
      }
    )
  },
  initialState
);