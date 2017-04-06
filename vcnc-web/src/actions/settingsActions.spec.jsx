/**
 * Created by nick on 3/9/17.
 */
import * as ActionTypes from '../constants/actionTypes';
import * as ActionCreators from './settingsActions';

describe('Actions', () => {
  it('should create an action to set the current vcnc host and port', () => {
    const expected = { type: ActionTypes.SET_CURRENT_VCNC, authority: 'h:66' };
    const actual = ActionCreators.setCurrentVcnc('h:66');
    expect(actual).toEqual(expected);
  });

  it('should create an action to set the current vtrq id', () => {
    const expected = { type: ActionTypes.SET_CURRENT_VTRQ, vtrqId: 16 };
    const actual = ActionCreators.setCurrentVtrq(16);
    expect(actual).toEqual(expected);
  });
});
