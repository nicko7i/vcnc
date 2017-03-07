import { combineReducers } from 'redux';
import app from './appReducer';
import fuelSavings from './fuelSavingsReducer';
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
  app,
  fuelSavings,
  routing: routerReducer,
});

export default rootReducer;
