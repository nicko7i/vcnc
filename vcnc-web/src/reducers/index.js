import { combineReducers } from 'redux';
import app from './appReducer';
import realtime from './realtimeReducer';
import settings from './settingsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  app,
  routing: routerReducer,
  realtime,
  settings,
});

export default rootReducer;
