import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { mainActions } from '../actions';
import { MainModel } from '../models/MainModel';
import * as pbActions from '../../lib/local/pbActions';

const initialState: RootState.mainState = 
  {
    responseMetrics: 'got2go fast',
    targetIP: '',
    filePath: '',
    trail: '',
    connectType: 'lol',
    mode: 'service_and_request',
    serviceList: [],
    requestList: [],
    serverResponse: ['response from server will go here'],
    packageDefinition: null,
    selectedService: null,
    selectedRequest: null,

  }
;

export const mainReducer = handleActions<RootState.mainState, MainModel>(
  {
    [mainActions.Type.HANDLE_IP_INPUT]: (state, action: { payload: string }) => {
      let newTrail:string
      if(action.payload === '') {
        newTrail = ` `
      } else {
        newTrail = `${action.payload} → ${state.selectedService} → ${state.selectedRequest}`
      }
      return {
        ...state,
        targetIP: action.payload,
        trail: newTrail
      }
    },
    [mainActions.Type.HANDLE_SERVICE_CLICK]: (state, action: { payload: string }) => {
      let writtenIP = 'IP';
      if (state.targetIP) writtenIP = state.targetIP;
      const newTrail = writtenIP + ' → ' + action.payload.service;
      return {
        ...state,
        selectedService: action.payload.service,
        trail: newTrail
      }
    },
    [mainActions.Type.HANDLE_REQUEST_CLICK]: (state, action: { payload: {request: string, service: string} }) => {
      //if there is a selectedservice, then add service + regex'd request string
      //else add just request string
      let newTrail:string;
      let writtenIP = 'IP';
      if (state.targetIP) writtenIP = state.targetIP;
      if (state.selectedService) {
        //let regexedString = action.payload.match(/(?<=→\ ).+/)
        newTrail = `${writtenIP} → ${state.selectedService} → ${action.payload.request}`
      } else {
        console.log('action.payload:', action.payload)
        newTrail = `${writtenIP} → ${action.payload.service} → ${action.payload.request}` 
      }
      return {
        ...state,
        selectedService: action.payload.service,
        selectedRequest: action.payload.request, 
        trail: newTrail
      }
    },
    [mainActions.Type.HANDLE_PROTO_UPLOAD]: (state, action) => {
      const filePath = action.payload[0].path;
      const packageDefinition = pbActions.loadProtoFile(filePath);
      //console.log('from reducer, parsed Package Definition:', pbActions.parsePackageDefinition(packageDefinition))
      const { protoServices, protoMessages } = pbActions.parsePackageDefinition(
        packageDefinition
      );

      return {
        ...state,
        filePath: filePath,
        packageDefinition: packageDefinition,
        serviceList: protoServices,
        requestList: protoMessages
      };
    },
    [mainActions.Type.HANDLE_SET_MODE]: (state, action) => ({
      ...state,
      mode: action.payload
    })
  },
  initialState
);
