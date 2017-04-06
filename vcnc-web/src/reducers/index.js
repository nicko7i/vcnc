import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import app from './appReducer';
import realtime from './realtimeReducer';
import settings from './settingsReducer';

const rootReducer = combineReducers({
  app,
  routing: routerReducer,
  realtime,
  settings,
});

export default rootReducer;
