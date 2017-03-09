import * as ActionTypes from '../constants/actionTypes';
import initialState from './initialState';
import reducer from './settingsReducer';

describe('Reducers::settings', () => {

  const getAppState = () => ({
    currentVcnc: 'leaf:4444',
    currentVtrq: 5935,
  });

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
});