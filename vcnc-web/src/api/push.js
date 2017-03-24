/**
 * Created by nick on 3/24/17.
 */
import * as actions from '../actions/realtimeActions';

function getRandomInt (min, max) {
  console.log('push getRandomInt')
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.setInterval(() => actions.updatePeercachePerformance({
    rVtrq: getRandomInt(50, 200),
    rVpm: getRandomInt(100, 150),
    rVp: getRandomInt(150, 250),
  }),
  5000);

export default {};