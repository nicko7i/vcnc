import * as types from '../constants/actionTypes';
import initialState from './initialState';

const nTrendPoints = 100;

function updateTrend(lst, pt) {
  const rtn = [ ...lst, pt ];
  if (rtn.length > nTrendPoints) rtn.shift();
  return rtn;
}

const reducers = {
  [types.UPDATE_PEERCACHE_PERFORMANCE]:
    (state, action) => ({
      ...state,
      rVtrqTrend: updateTrend(state.rVtrqTrend, action.payload.rVtrq),
      rVpmTrend: updateTrend(state.rVpmTrend, action.payload.rVpm),
      rVpTrend: updateTrend(state.rVpTrend, action.payload.rVp),
      ...action.payload,
    }),
  [types.UPDATE_ZERO_TIME_SYNC_PERFORMANCE]:
    (state, action) => ({ ...state, ...action.payload}),
};

const leaveStateUnchanged = (state) => state;

export default (state = initialState.realtime, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};
