/**
 * Created by nick on 10/4/16.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/realtimeActions';
import { Doughnut } from 'react-chartjs-2';

const getState = (data, backgroundColor) => ({
  labels: [
    'vtrq',
    'vpm',
    'vp',
  ],
  datasets: [{
    data: [ ...data ],
    backgroundColor: [ ...backgroundColor ],
  }]
});

const FrquCacheDoughnut = props => (
  <div width="300 px">
  <Doughnut data={getState(props.data, props.backgroundColor)} />
  </div>
);

FrquCacheDoughnut.propTypes = {
  actions: PropTypes.object,
  data: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    backgroundColor: [
      state.theme.colorVtrq,
      state.theme.colorVpm,
      state.theme.colorVp,
    ],
    data: [
      state.realtime.rVtrq,
      state.realtime.rVpm,
      state.realtime.rVp,
      ],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrquCacheDoughnut);
