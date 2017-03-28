import {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/realtimeActions';

//
//  ExternalEvents injects external data (for example data received from a
//  WebSocket) into the React/Redux cycle.
//
//  A null component is created solely to receive the appropriate dispatch
//  function from connect().
//
//  See Dan Abramov's answer: https://github.com/reactjs/redux/issues/916#issuecomment-149190441


//  Gaussian random number generation taken from
//
//  http://stackoverflow.com/a/22080644 and http://jsfiddle.net/Xotic750/3rfT6/
//
const boxMullerRandom = (function () {
  let phase = 0,
    RAND_MAX,
    array,
    random,
    x1, x2, w, z;

  if (crypto && typeof crypto.getRandomValues === 'function') {
    RAND_MAX = Math.pow(2, 32) - 1;
    array = new Uint32Array(1);
    random = function () {
      crypto.getRandomValues(array);

      return array[0] / RAND_MAX;
    };
  } else {
    random = Math.random;
  }

  return function () {
    if (!phase) {
      do {
        x1 = 2.0 * random() - 1.0;
        x2 = 2.0 * random() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);

      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      z = x1 * w;
    } else {
      z = x2 * w;
    }

    phase ^= 1;

    return z;
  };
}());

/*
function nextTimePoint(prev) {
  return prev + boxMullerRandom();
}
*/

function startPushSimulation(dispatch) {
  let rVtrq = 50;
  let rVpm = 25;
  let rVp = 100 - rVtrq - rVpm;
  window.setInterval(() => {
    rVtrq += boxMullerRandom();
    rVpm += boxMullerRandom();
    rVp = 100 - rVtrq - rVpm;
    const data = {
      // rVtrq: getRandomInt(50, 200),
      // rVpm: getRandomInt(100, 150),
      // rVp: getRandomInt(150, 250),
      rVtrq,
      rVpm,
      rVp,
    };
    dispatch(actions.updatePeercachePerformance(data));
  },
  10000
  );
}

class ExternalEvents extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    startPushSimulation(this.props.dispatch);
  }

  render() {  return null; }
}

ExternalEvents.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default connect()(ExternalEvents);
