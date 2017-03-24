import * as types from '../constants/actionTypes';
import initialState from './initialState';

const reducers = {
  [types.UPDATE_PEERCACHE_PERFORMANCE]:
    (state, action) => ({ ...state, ...action.payload }),
  [types.UPDATE_ZERO_TIME_SYNC_PERFORMANCE]:
    (state, action) => ({ ...state, ...action.payload}),
};

const leaveStateUnchanged = (state) => state;

export default (state = initialState.realtime, action) => {
  console.log('rtreducer', state, action.payload)
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};
