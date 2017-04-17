import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Websocket from 'react-websocket';
import * as actions from '../actions/realtimeActions';

//
//  ExternalEvents injects external data (for example data received from a
//  WebSocket) into the React/Redux cycle.
//
//  A null component is created solely to receive the appropriate dispatch
//  function from connect().
//
//  See Dan Abramov's answer: https://github.com/reactjs/redux/issues/916#issuecomment-149190441

function ExternalEvents(props) {
  const handleData = (data) => {
    const { rVpm, rVtrq, storageEfficiency } = JSON.parse(data);
    props.dispatch(
      actions.updateVtrqPerformance({ storageEfficiency }));
    props.dispatch(actions.updatePeercachePerformance({
      rVpm,
      rVtrq,
      rVp: 13,
    }));
  };

  return (
    <Websocket url="ws://localhost:6130/" onMessage={handleData} />
  );
}

ExternalEvents.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(ExternalEvents);
