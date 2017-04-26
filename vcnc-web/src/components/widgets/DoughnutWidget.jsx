import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import muiThemeable from 'material-ui/styles/muiThemeable';
import WidgetFrame from './WidgetFrame';

const DoughnutWidget = props => (
  <WidgetFrame title={props.title}>
    <div style={{ height: props.muiTheme.dashboard.canvasHeight }}>
      <Doughnut data={props.data} options={{ maintainAspectRatio: false }} />
    </div>
  </WidgetFrame>
);

DoughnutWidget.propTypes = {
  canvasHeight: PropTypes.string,
  data: PropTypes.object,  // eslint-disable-line react/no-unused-prop-types
  muiTheme: PropTypes.object,
  title: PropTypes.string,
};

export default muiThemeable()(DoughnutWidget);

