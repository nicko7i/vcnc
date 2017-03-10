import * as ActionTypes from '../constants/actionTypes';
import { createStore } from 'redux';
import initialState from '../reducers/initialState';
import rootReducer from '../reducers';

describe('Store', () => {

  it('should alter the initial state', () => {
    const store = createStore(rootReducer, initialState);

    const actions = [
      { type: ActionTypes.OPEN_OR_CLOSE_NAV_DRAWER, open: true },
      { type: ActionTypes.SET_CURRENT_VTRQ, vtrqId: 15 },
      { type: ActionTypes.SET_CURRENT_VCNC, authority: 'kiwi:80321' },
    ];
    actions.forEach(action => store.dispatch(action));

    const actual = store.getState();
    const expected = {
      app: {
        navDrawerOpen: true,
      },
      settings: {
        currentVcnc: 'kiwi:80321',
        currentVtrq: 15,
      }
    };

    expect(actual.app).toEqual(expected);
  });
});
