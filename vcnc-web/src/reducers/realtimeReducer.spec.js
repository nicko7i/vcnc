import * as ActionTypes from '../constants/actionTypes';
import reducer from './realtimeReducer';
/* eslint-disable object-property-newline */
describe('Reducers::realtime', () => {
  it('should not mutate state', () => {
    const action = {
      type: ActionTypes.UPDATE_PEERCACHE_PERFORMANCE,
      payload: { rVtrq: 44, rVpm: 45, rVp: 46 },
    };
    const initial = {
      rVtrq: 0, rVpm: 0, rVp: 0,
      rVtrqTrend: [], rVpmTrend: [], rVpTrend: [],
    };
    const initialVtrqTrendRef = initial.rVtrqTrend;
    const expected = {
      rVtrq: 44, rVpm: 45, rVp: 46,
      rVtrqTrend: [44], rVpmTrend: [45], rVpTrend: [46],
    };
    const result = reducer(initial, action);

    expect(result).toEqual(expected);
    expect(initial).toEqual({
      rVtrq: 0, rVpm: 0, rVp: 0,
      rVtrqTrend: [], rVpmTrend: [], rVpTrend: [],
    });
    expect(initialVtrqTrendRef).toBe(initial.rVtrqTrend);
    expect([]).not.toBe([]);
  });
  /*
  it('should set initial state by default', () => {
    const action = { type: 'unknown' };
    const expected = initialState.settings;

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('should set the current vcnc authority', () => {
    const action = { type: ActionTypes.SET_CURRENT_VCNC, authority: 'grape:59' };
    const expected = { ...getAppState(), currentVcnc: 'grape:59' };

    expect(reducer(getAppState(), action))
    .toEqual(expected);
  });

  it('should set the current vtrq id', () => {
    const action = { type: ActionTypes.SET_CURRENT_VTRQ, vtrqId: 6858 };
    const expected = { ...getAppState(), currentVtrq: 6858 };

    expect(reducer(getAppState(), action))
    .toEqual(expected);
  });
  */
});

