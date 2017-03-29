import {boxMullerRandom} from './random';

describe('lib::random', () => {
  const samples = [...Array(100)].map(boxMullerRandom);
  it('should produce numbers less than -1', () => {
    expect(Math.min.apply(null, samples)).toBeLessThan(-1);
  });
  it('should produce numbers greater than 1', () => {
    expect(Math.max.apply(null, samples)).toBeGreaterThan(1);
  });
});