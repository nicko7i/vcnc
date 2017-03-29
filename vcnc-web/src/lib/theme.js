
export const vtrq = '#ABCDEE';
export const vpm = '#123456';
export const vp = '#004499';

export function asRgba(hex, alpha=1) {
  const checkHex = (r, g,  b) => {
    if ([r, g, b].reduce((a,v) => a || isNaN(v), false)) {
      throw Error('argument ' + hex + ' is not hexadecimal')
    }
  }
  if (hex[0] !== '#') {
    throw Error('color must start with #');
  }
  if (hex.length == 7) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5), 16);
    checkHex(r, g, b);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }
  if (hex.length == 4) {
    const r = parseInt(hex.slice(1,2), 16);
    const g = parseInt(hex.slice(2,3), 16);
    const b = parseInt(hex.slice(3), 16);
    checkHex(r, g, b);
    return 'rgba(' + (r+16*r) + ',' + (g+16*g) + ',' + (b+16*b) + ',' + alpha + ')';
  }
  throw Error('argument ' + hex + ' is invalid')
}

