import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/realtimeActions';
import {Line} from 'react-chartjs-2';

function sliceAndFill(arr, size, fill=null) {
  const rtn = arr.slice(-size);
  while (rtn.length <= size) rtn.unshift(fill);
  return rtn;
}

const getState = (data) => ({
  options: { duration: 10000 },
  labels: [
    '-7 min',
    '',
    '',
    '',
    '',
    '',
    '-6 min',
    '',
    '',
    '',
    '',
    '',
    '-5 min',
    '',
    '',
    '',
    '',
    '',
    '-4 min',
    '',
    '',
    '',
    '',
    '',
    '-3 min',
    '',
    '',
    '',
    '',
    '',
    '-2 min',
    '',
    '',
    '',
    '',
    '',
    '-1 min',
    '',
    '',
    '',
    '',
    '',
  ],
  datasets: [
    {
      label: 'vTRQ',
      fill: false,
      lineTension: 0.1,
      strokeColor: '#E8575A',
      borderColor: '#E8575A',
      pointBorderColor: '#E8575A',
      pointBackgroundColor: '#fff',
      data: sliceAndFill(data.rVtrqTrend, 42),
    },
    {
      label: 'vPM',
      fillColor: 'rgba(151,187,205,0.2)',
      strokeColor: 'rgba(151,187,205,1)',
      pointColor: 'rgba(151,187,205,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(151,187,205,1)',
      data: sliceAndFill(data.rVpmTrend, 42),
    },
    {
      label: 'VP',
      fillColor: 'rgba(66,199,51,0.2)',
      strokeColor: 'rgba(66,199,51,1)',
      pointColor: 'rgba(66,199,51,1)',
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(66,199,51,1)',
      data: sliceAndFill(data.rVpTrend, 42),
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

