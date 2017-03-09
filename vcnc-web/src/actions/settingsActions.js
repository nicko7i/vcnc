import * as types from '../constants/actionTypes';

export function setCurrentVcnc(authority) {
  return { type: types.SET_CURRENT_VCNC, authority };
}

export function setCurrentVtrq(vtrqId) {
  return { type: types.SET_CURRENT_VTRQ, vtrqId };
}
