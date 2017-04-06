import * as types from '../constants/actionTypes';
import initialState from './initialState';

const reducers = {
  [types.SET_CURRENT_VCNC]:
    (state, action) => ({ ...state, currentVcnc: action.authority }),
  [types.SET_CURRENT_VTRQ]:
    (state, action) => ({ ...state, currentVtrq: action.vtrqId }),
};

const leaveStateUnchanged = state => state;

export default (state = initialState.settings, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};

