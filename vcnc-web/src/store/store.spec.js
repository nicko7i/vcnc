import { createStore } from 'redux';
import * as ActionTypes from '../constants/actionTypes';
import initialState from '../reducers/initialState';
import rootReducer from '../reducers';

describe('Store', () => {
  it('should alter the initial state', () => {
    const store = createStore(rootReducer, initialState);

    const actions = [
      { type: ActionTypes.OPEN_OR_CLOSE_NAV_DRAWER, open: true },
      { type: ActionTypes.SET_CURRENT_VTRQ, vtrqId: 15 },
      { type: ActionTypes.SET_CURRENT_VCNC, authority: 'kiwi:80321' },
      { type: ActionTypes.UPDATE_PEERCACHE_PERFORMANCE,
        payload: {
          rVtrq: 100,
          rVpm: 200,
          rVp: 300,
        } },
      { type: ActionTypes.UPDATE_ZERO_TIME_SYNC_PERFORMANCE,
        payload: {
          ztsColdFiles: 110,
          ztsWarmFiles: 220,
          ztsHotFiles: 330,
          ztsColdKB: 111,
          ztsWarmKB: 222,
          ztsHotKB: 333,
        } },
    ];
    actions.forEach(action => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      app: {
        navDrawerOpen: true,
      },
      realtime: {
        ...actual.realtime,
        rVtrq: 100,
        rVpm: 200,
        rVp: 300,
        rVtrqTrend: [100],
        rVpmTrend: [200],
        rVpTrend: [300],
        ztsColdFiles: 110,
        ztsWarmFiles: 220,
        ztsHotFiles: 330,
        ztsColdKB: 111,
        ztsWarmKB: 222,
        ztsHotKB: 333,
      },
      settings: {
        currentVcnc: 'kiwi:80321',
        currentVtrq: 15,
      },
    };

    expect(actual.app).toEqual(expected.app);
    expect(actual.realtime).toEqual(expected.realtime);
    expect(actual.settings).toEqual(expected.settings);
  });
});
