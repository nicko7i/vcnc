import {asRgba} from './theme';

describe('lib::theme', () => {
  it('should parse a 6 digit color', () => {
    expect(asRgba('#0A20FF')).toEqual('rgba(10,32,255,1)')
  });
  it('should parse a 3 digit color', () => {
    expect(asRgba('#F84')).toEqual('rgba(255,136,68,1)')
  });
  it('should throw if no leading #', () => {
    expect(() => asRgba('@AAAAAA')).toThrow();
  });
  it('should throw if invalid length', () => {
    expect(() => asRgba('#F845')).toThrow();
  });
  it('should honor the alpha channel argument', () => {
    expect(asRgba('#f84', 0.2)).toEqual('rgba(255,136,68,0.2)')
  });
  it('should do something when not hex', () => {
    expect(() => asRgba('#xxx')).toThrow();
  });
});