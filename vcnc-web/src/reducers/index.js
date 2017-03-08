import { combineReducers } from 'redux';
import app from './appReducer';
import fuelSavings from './fuelSavingsReducer';
import settings from './settingsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  app,
  fuelSavings,
  routing: routerReducer,
  settings
});

export default rootReducer;
