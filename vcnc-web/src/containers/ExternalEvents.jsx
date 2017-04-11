import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Websocket from 'react-websocket';
import * as actions from '../actions/realtimeActions';
import { trend } from '../lib/sequence';

//
//  ExternalEvents injects external data (for example data received from a
//  WebSocket) into the React/Redux cycle.
//
//  A null component is created solely to receive the appropriate dispatch
//  function from connect().
//
//  See Dan Abramov's answer: https://github.com/reactjs/redux/issues/916#issuecomment-149190441

function startFrquPushSimulation(dispatch) {
  const fVtrq = trend(0, 80, 70, 2);
  const fVpm = trend(10, 70, 50, 2);
  const fVp = trend(2, 30, 2, 2);
  const makeData = () => {
    const rVtrq = fVtrq();
    const rVpm = fVpm();
    const rVp = fVp();
    const sum = rVtrq + rVpm + rVp;
    return {
      rVtrq: (rVtrq / sum) * 100,
      rVpm: (rVpm / sum) * 100,
      rVp: (rVp / sum) * 100,
    };
  };
  dispatch(actions.updatePeercachePerformance(makeData()));
  //
  window.setInterval(() => {
    dispatch(actions.updatePeercachePerformance(makeData()));
  },
  10000,
  );
}

function startVtrqPullSimulation(dispatch) {
  const fStorageEfficiency = trend(-1, 10, 1, 0.5);
  window.setInterval(() => {
    dispatch(actions.updateVtrqPerformance({ storageEfficiency: fStorageEfficiency() }));
  },
  15000,
  );
}

function handleData(data) {
  console.log(JSON.parse(data));
}


class ExternalEvents extends Component {

  componentDidMount() {
    startFrquPushSimulation(this.props.dispatch);
    startVtrqPullSimulation(this.props.dispatch);
  }

  render() {
    return (
      <Websocket url="ws://localhost:6130/" onMessage={handleData} />
    );
  }
}

ExternalEvents.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


export default connect()(ExternalEvents);
