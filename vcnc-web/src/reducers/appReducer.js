import * as types from '../constants/actionTypes';

const reducers = {
  [types.CLOSE_NAV_DRAWER]: (state) => Object.assign({}, state, false),
  [types.OPEN_NAV_DRAWER]: (state) => Object.assign({}, state, true),
  // [types.CLOSE_NAV_DRAWER]: (state) => { ...state, navDrawerOpen: false },
  // [types.OPEN_NAV_DRAWER]: (state) => { ...state, navDrawerOpen: true },
};

const leaveStateUnchanged = (state) => state;

export default (state = {}, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action.payload);
};
