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

const dataSet = (e, length) => ({
  label: e.label,
  fill: false,
  lineTension: 0.1,
  strokeColor: e.color,
  borderColor: e.color,
  pointBorderColor: e.color,
  pointBackgroundColor: '#fff',
  data: sliceAndFill(e.data, length),
});

function getState(props) {
  return {
    labels: props.labels,
    datasets: props.lines.map(e => dataSet(e, props.labels.length)),
  };
}

const TrendWidget = props => (
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

TrendWidget.propTypes = {
  labels: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  lines: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  muiTheme: PropTypes.object,
  title: PropTypes.string,
};

export default muiThemeable()(TrendWidget);

