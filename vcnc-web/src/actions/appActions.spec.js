import * as ActionTypes from '../constants/actionTypes';
import * as ActionCreators from './appActions';

describe('Actions', () => {

  it('should create an action to open the nav tray', () => {
    const expected = { type: ActionTypes.OPEN_NAV_DRAWER };
    const actual = ActionCreators.openNavDrawer();
    expect(actual).toEqual(expected);
  });

  it('should create an action to close the nav tray', () => {
    const expected = { type: ActionTypes.CLOSE_NAV_DRAWER };
    const actual = ActionCreators.closeNavDrawer();
    expect(actual).toEqual(expected);
  });

});