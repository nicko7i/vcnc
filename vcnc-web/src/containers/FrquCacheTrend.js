import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/realtimeActions';
import {Line} from 'react-chartjs-2';

const getState = (data) => ({
  labels: ['10', '20', '30', '40', '50', '60', '70'],
  datasets: [
    {
      label: 'Signal',
      fillColor: '#F1E7E5',
      strokeColor: '#E8575A',
      pointColor: '#E8575A',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#ff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: data.rVtrqTrend,
    },
    {
      label: 'Disturbance',
      fillColor: 'rgba(151,187,205,0.2)',
      strokeColor: 'rgba(151,187,205,1)',
      pointColor: 'rgba(151,187,205,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(151,187,205,1)',
      data: data.rVpmTrend,
    },
  ],
});

const FrquCacheTrend = props => (
  <Line data={getState(props.data)} />
);

FrquCacheTrend.propTypes = {
  actions: PropTypes.object,
  data: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    data: {
      rVtrqTrend: state.realtime.rVtrqTrend,
      rVpmTrend: state.realtime.rVpmTrend,
      rVpTrend: state.realtime.rVpTrend,
    }
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
)(FrquCacheTrend);

