import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { mainActions } from '../actions';
import { MainModel } from '../models/MainModel';

const initialState: RootState.mainState = [
  {
    responseDisplay: 'eggplant 🍆',
    responseMetrics: 'string',
    targetIP: 'eggplant',
    filePath: 'omg',
    trail: 'eggplant',
    connectType: 'lol'
  }
];

export const mainReducer = handleActions<RootState.mainState, MainModel>(
  {
    [mainActions.Type.HANDLE_IP_INPUT]: (state, action) => (
      {
        targetIP: action.payload,
        ...state
      }
    ),
    [mainActions.Type.HANDLE_PROTO_UPLOAD]: (state, action) => (
      {
        filePath: action.payload[0].path,
        ...state
      }
    ),
  },
  initialState
);