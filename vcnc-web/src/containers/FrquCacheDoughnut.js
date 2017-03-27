/**
 * Created by nick on 10/4/16.
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/realtimeActions';
import { Doughnut } from 'react-chartjs-2';

const getState = (data) => ({
  labels: [
    'vp',
    'vpm',
    'vtrq'
  ],
  datasets: [{
    data: data,
    backgroundColor: [
      '#CCC',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
});

const FrquCacheDoughnut = props => (
  <Doughnut data={getState(props.data)} />
);

FrquCacheDoughnut.propTypes = {
  actions: PropTypes.object,
  data: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    data: [
      state.realtime.rVtrq,
      state.realtime.rVpm,
      state.realtime.rVp,
      ]
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
