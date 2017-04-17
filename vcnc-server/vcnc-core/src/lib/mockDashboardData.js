/*  eslint-disable no-restricted-properties */

//  Gaussian random number generation taken from
//
//  http://stackoverflow.com/a/22080644 and http://jsfiddle.net/Xotic750/3rfT6/
//
const crypto = require('crypto');

const boxMullerRandom = (() => {
  let phase = 0;
  let RAND_MAX;
  let array;
  let random;
  let x1;
  let x2;
  let w;
  let z;

  if (crypto && typeof crypto.getRandomValues === 'function') {
    RAND_MAX = Math.pow(2, 32) - 1;
    array = new Uint32Array(1);
    random = (() => {
      crypto.getRandomValues(array);

      return array[0] / RAND_MAX;
    });
  } else {
    random = Math.random;
  }

  return () => {
    if (!phase) {
      do {
        x1 = (2.0 * random()) - 1.0;
        x2 = (2.0 * random()) - 1.0;
        w = (x1 * x1) + (x2 * x2);
      } while (w >= 1.0);

      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      z = x1 * w;
    } else {
      z = x2 * w;
    }

    phase = !phase;

    return z;
  };
})();

//
//  Calls function 'f' as many times as necessary to return a value on the
//  interval [min, max]
//
function within(min, max, f) {
  let rtn = f();
  while (rtn < min || rtn > max) { rtn = f(); }
  return rtn;
}

//
//  Returns a function that, when called, returns the next value of a
//  Gaussian random walk.
//
function trend(min, max, initial = 0, scale = 1) {
  let value = initial;
  return () => {
    value = within(min, max, () => value + (scale * boxMullerRandom()));
    return value;
  };
}

//
//  Returns a function that, when called, returns a mock dashboard data object
//  for a time point.
//
function mockDashboardData() {
  const fVtrq = trend(0, 80, 70, 2);
  const fVpm = trend(10, 70, 50, 2);
  const fStorageEfficiency = trend(-1, 10, 1, 0.5);
  return () => ({
    storageEfficiency: fStorageEfficiency(),
    rVtrq: fVtrq(),
    rVpm: fVpm(),
  });
}

module.exports = mockDashboardData;
