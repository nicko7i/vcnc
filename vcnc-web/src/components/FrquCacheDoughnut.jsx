import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import muiThemeable from 'material-ui/styles/muiThemeable';

function getState(props) {
  const { vtrqColor, vpmColor, vpColor } = props.muiTheme.palette;

  return {
    labels: [
      'vtrq',
      'vpm',
      'vp',
    ],
    datasets: [{
      data: [...props.data],
      backgroundColor: [vtrqColor, vpmColor, vpColor],
    }],
  };
}

const FrquCacheDoughnut = props => (
  <div style={{ height: props.muiTheme.dashboard.canvasHeight }}>
    <Doughnut data={getState(props)} options={{ maintainAspectRatio: false }} />
  </div>
);

FrquCacheDoughnut.propTypes = {
  canvasHeight: PropTypes.string,
  data: PropTypes.array,  // eslint-disable-line react/no-unused-prop-types
  muiTheme: PropTypes.object,
};

export default muiThemeable()(FrquCacheDoughnut);

