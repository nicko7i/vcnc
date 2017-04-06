import { trend } from './sequence';

describe('lib::sequence', () => {
  it('should stay within bounds', () => {
    const f = trend(0, 100, 50, 50);
    const sample = [...Array(100)].map(f);

    expect(Math.max.apply(null, sample)).toBeLessThan(100);
    expect(Math.min.apply(null, sample)).toBeGreaterThan(0);
  });
});
