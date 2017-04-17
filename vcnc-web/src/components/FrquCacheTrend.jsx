import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

function sliceAndFill(arr, size, fill = null) {
  const rtn = arr.slice(-size);
  while (rtn.length <= size) rtn.unshift(fill);
  return rtn;
}

const labels = [
  '-7 min', '', '', '', '', '',
  '-6 min', '', '', '', '', '',
  '-5 min', '', '', '', '', '',
  '-4 min', '', '', '', '', '',
  '-3 min', '', '', '', '', '',
  '-2 min', '', '', '', '', '',
  '-1 min', '', '', '', '', 'now',
];


const dataSet = e => ({
  label: e.label,
  fill: false,
  lineTension: 0.1,
  strokeColor: e.color,
  borderColor: e.color,
  pointBorderColor: e.color,
  pointBackgroundColor: '#fff',
  data: sliceAndFill(e.data, labels.length),
});

function getState(props) {
  return {
    labels,
    datasets: props.lines.map(e => dataSet(e)),
  };
}

const FrquCacheTrend = props => (
  <Line data={getState(props)} options={{ scales: { xAxes: [{ gridLines: false }] } }} />
);

FrquCacheTrend.propTypes = {
  lines: PropTypes.array,
};

export default FrquCacheTrend;

