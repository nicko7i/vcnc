import * as types from '../constants/actionTypes';

export function setCurrentVtrq(vtrqId) {
  return { type: types.SET_CURRENT_VTRQ, vtrqId };
}
