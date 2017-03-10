import { combineReducers } from 'redux';
import app from './appReducer';
import settings from './settingsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  app,
  routing: routerReducer,
  settings
});

export default rootReducer;
