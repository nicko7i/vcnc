import {boxMullerRandom} from './random';

function within(min, max, f) {
  let rtn = f();
  while (rtn < min || rtn > max) { rtn = f(); }
  return rtn;
}

export function trend(min, max, initial=0, scale=1) {
  let value = initial;
  return () => {
    value = within(min, max, () => value + scale * boxMullerRandom());
    return value;
  };
}