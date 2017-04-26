import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import muiThemeable from 'material-ui/styles/muiThemeable';
import WidgetFrame from './WidgetFrame';

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

const FrquCacheTrendWidget = props => (
  <WidgetFrame title={props.title}>
    <div style={{ height: props.muiTheme.dashboard.canvasHeight }}>
      <Line
        data={getState(props)} options={{
          maintainAspectRatio: false,
          scales: { xAxes: [{ gridLines: false }] },
        }}
      />
    </div>
  </WidgetFrame>
);

FrquCacheTrendWidget.propTypes = {
  lines: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  muiTheme: PropTypes.object,
  title: PropTypes.string,
};

export default muiThemeable()(FrquCacheTrendWidget);

