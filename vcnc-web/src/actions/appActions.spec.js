import * as ActionTypes from '../constants/actionTypes';
import * as ActionCreators from './appActions';

describe('Actions', () => {

  it('should create an action to move the tray', () => {
    const expected = { type: ActionTypes.OPEN_OR_CLOSE_NAV_DRAWER };
    const actual = ActionCreators.openOrCloseNavDrawer();
    expect(actual).toEqual(expected);
  });

  it('should create an action to toggle the tray position', () => {
    const expected = { type: ActionTypes.TOGGLE_NAV_DRAWER };
    const actual = ActionCreators.toggleNavDrawer();
    expect(actual).toEqual(expected);
  });

});