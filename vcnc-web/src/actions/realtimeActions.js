import * as types from '../constants/actionTypes';
import push from '../api/push';

/*
export function updatePeercachePerformance(payload) {
  console.log('action updatePeercachePerformance', payload)
  return { type: types.UPDATE_PEERCACHE_PERFORMANCE, payload };
}
*/
export function updatePeercachePerformance(payload) {
  console.log('action updatePeercachePerformance', payload)
  return (() => {
    return { type: types.UPDATE_PEERCACHE_PERFORMANCE, payload };
  })
}

export function updateZeroTimeSyncPerformance(payload) {
  return { type: types.UPDATE_ZERO_TIME_SYNC_PERFORMANCE, payload };
}
