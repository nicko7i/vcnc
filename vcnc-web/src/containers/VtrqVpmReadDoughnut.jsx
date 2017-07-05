import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import DoughnutWidget from '../components/widgets/DoughnutWidget';

const readRatesAreZero = data =>
  data.reduce((accumulator, item) => accumulator + item, 0) < 1e-6;

const VtrqVpmDoughnut = (props) => {
  //
  //  When all the values to a Doughnut are zero, jsChart doesn't display
  //  anything at all.  We prefer to display a grey doughnut (grey to
  //  indicate that it is "grey-ed out").  Since the values are equally
  //  zero, we make the areas equal size.

  const { emptyDoughnutColor, vpmColor, vtrqColor } = props.muiTheme.palette;
  const doughnutIsEmpty = readRatesAreZero(props.data.datasets[0].data);
  const data = {
    ...props.data,
    datasets: doughnutIsEmpty
      ? [{ data: [1, 1], backgroundColor: [emptyDoughnutColor, emptyDoughnutColor] }]
      : [{ data: props.data.datasets[0].data, backgroundColor: [vtrqColor, vpmColor] }],
  };

  return (
    <DoughnutWidget data={data} title={props.title} />
  );
};

VtrqVpmDoughnut.propTypes = {
  data: PropTypes.object,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    data: {
      labels: [
        'vtrq',
        'vpm',
      ],
      datasets: [{
        data: [
          state.realtime.rVtrq,
          state.realtime.rVpm,
        ],
      }],
    },
  };
}

export default muiThemeable()(connect(
  mapStateToProps,
)(VtrqVpmDoughnut));
