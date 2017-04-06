import React, { PropTypes } from 'react';
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
  <Doughnut data={getState(props)} />
);

FrquCacheDoughnut.propTypes = {
  data: PropTypes.array,
};

export default muiThemeable()(FrquCacheDoughnut);

