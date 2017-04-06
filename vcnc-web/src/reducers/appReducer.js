import * as types from '../constants/actionTypes';
import initialState from './initialState';

const reducers = {
  [types.OPEN_OR_CLOSE_NAV_DRAWER]:
    (state, action) => ({ ...state, navDrawerOpen: action.open }),
  [types.TOGGLE_NAV_DRAWER]:
    state => ({ ...state, navDrawerOpen: !state.navDrawerOpen }),
};

const leaveStateUnchanged = state => state;

export default (state = initialState.app, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};
