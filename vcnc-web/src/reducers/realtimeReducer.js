import * as types from '../constants/actionTypes';
import initialState from './initialState';

//
//  Set this to be at least the number of points needed by any widget.
const maxTrendPoints = 100;

function updateTrend(lst, pt) {
  return [...lst.slice(-maxTrendPoints + 1), pt];
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
  [types.UPDATE_VTRQ_PERFORMANCE]:
    (state, action) => ({
      ...state,
      storageEfficiencyTrend: updateTrend(
        state.storageEfficiencyTrend,
        action.payload.storageEfficiency),
      sumExtentsTrend: updateTrend(state.sumExtentsTrend, action.payload.sumExtents),
      sumStSizeTrend: updateTrend(state.sumStSizeTrend, action.payload.sumStSize),
      ...action.payload,
    }),
  [types.UPDATE_ZERO_TIME_SYNC_PERFORMANCE]:
    (state, action) => ({
      ...state,
      ztsColdFilesTrend: updateTrend(state.ztsColdFilesTrend, action.payload.ztsColdFiles),
      ztsWarmFilesTrend: updateTrend(state.ztsWarmFilesTrend, action.payload.ztsWarmFiles),
      ztsHotFilesTrend: updateTrend(state.ztsHotFilesTrend, action.payload.ztsHotFiles),
      ztsColdKBTrend: updateTrend(state.ztsColdKBTrend, action.payload.ztsColdKB),
      ztsWarmKBTrend: updateTrend(state.ztsWarmKBTrend, action.payload.ztsWarmKB),
      ztsHotKBTrend: updateTrend(state.ztsHotKBTrend, action.payload.ztsHotKB),
      ...action.payload,
    }),
};

const leaveStateUnchanged = state => state;

export default (state = initialState.realtime, action) => {
  if (state === null) return {};
  const reducer = reducers[action.type] || leaveStateUnchanged;
  return reducer(state, action);
};
