import * as types from '../constants/actionTypes';

export function updateVtrqPerformance(payload) {
  return { type: types.UPDATE_VTRQ_PERFORMANCE, payload };
}

export function updatePeercachePerformance(payload) {
  return { type: types.UPDATE_PEERCACHE_PERFORMANCE, payload };
}

export function updateZeroTimeSyncPerformance(payload) {
  return { type: types.UPDATE_ZERO_TIME_SYNC_PERFORMANCE, payload };
}
