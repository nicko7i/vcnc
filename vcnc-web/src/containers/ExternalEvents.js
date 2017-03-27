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

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startPushSimulation(dispatch) {
  window.setInterval(() => {
    const data = {
      rVtrq: getRandomInt(50, 200),
      rVpm: getRandomInt(100, 150),
      rVp: getRandomInt(150, 250),
    };
    dispatch(actions.updatePeercachePerformance(data));
  },
  5000
  );
}

class ExternalEvents extends Component {
  constructor(props) {
    super(props);
    startPushSimulation(this.props.dispatch);
  }

  render() {  return null; }
}

ExternalEvents.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default connect()(ExternalEvents);
