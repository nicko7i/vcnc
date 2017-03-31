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

const labels = [
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
];

const dataSet = (e) =>({
  label: e.label,
  fill: false,
  lineTension: 0.1,
  strokeColor: e.color,
  borderColor: e.color,
  pointBorderColor: e.color,
  pointBackgroundColor: '#fff',
  data: sliceAndFill(e.data, labels.length)
});

const getState = (lines) => ({
  labels: [
    '-7 min', '', '', '', '', '',
    '-6 min', '', '', '', '', '',
    '-5 min', '', '', '', '', '',
    '-4 min', '', '', '', '', '',
    '-3 min', '', '', '', '', '',
    '-2 min', '', '', '', '', '',
    '-1 min', '', '', '', '', '',
  ],
  datasets: lines.map(e => dataSet(e)),
});

const FrquCacheTrend = props => (
  <Line data={getState(props.lines)} />
);

FrquCacheTrend.propTypes = {
  actions: PropTypes.object,
  lines: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    lines: [
      { label: 'vTRQ', color: state.theme.colorVtrq, data: state.realtime.rVtrqTrend },
      { label: 'vPM', color: state.theme.colorVpm, data: state.realtime.rVpmTrend },
      { label: 'VP', color: state.theme.colorVp, data: state.realtime.rVpTrend },
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
)(FrquCacheTrend);

