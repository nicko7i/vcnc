import * as ActionTypes from '../constants/actionTypes';
import reducer from './appReducer';

describe('Reducers::app', () => {
  const getInitialState = () => ({ navDrawerOpen: false });

  const getAppState = () => ({ navDrawerOpen: true });

  it('should set initial state by default', () => {
    const action = { type: 'unknown' };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('should open the nav drawer', () => {
    const action = { type: ActionTypes.OPEN_OR_CLOSE_NAV_DRAWER, open: true };
    const expected = { ...getAppState(), navDrawerOpen: true };

    expect(reducer({ ...getAppState(), navDrawerOpen: false }, action))
    .toEqual(expected);
  });

  it('should close the nav drawer', () => {
    const action = { type: ActionTypes.OPEN_OR_CLOSE_NAV_DRAWER, open: false };
    const expected = { ...getAppState(), navDrawerOpen: false };

    expect(reducer({ ...getAppState(), navDrawerOpen: true }, action))
    .toEqual(expected);
  });

  it('should toggle the nav drawer closed to open', () => {
    const action = { type: ActionTypes.TOGGLE_NAV_DRAWER };
    const expected = { ...getAppState(), navDrawerOpen: true };

    expect(reducer({ ...getAppState(), navDrawerOpen: false }, action))
    .toEqual(expected);
  });

  it('should toggle the nav drawer open to closed', () => {
    const action = { type: ActionTypes.TOGGLE_NAV_DRAWER };
    const expected = { ...getAppState(), navDrawerOpen: false };

    expect(reducer({ ...getAppState(), navDrawerOpen: true }, action))
    .toEqual(expected);
  });
});
