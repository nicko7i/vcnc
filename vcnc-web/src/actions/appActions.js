import * as types from '../constants/actionTypes';

export function openOrCloseNavDrawer(open) {
  return { type: types.OPEN_OR_CLOSE_NAV_DRAWER, open };
}

export function toggleNavDrawer() { return { type: types.TOGGLE_NAV_DRAWER }; }
