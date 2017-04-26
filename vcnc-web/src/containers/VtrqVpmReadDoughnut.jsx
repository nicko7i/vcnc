import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import DoughnutWidget from '../components/widgets/DoughnutWidget';

const VtrqVpmDoughnut = (props) => {
  const { vtrqColor, vpmColor } = props.muiTheme.palette;
  const backgroundColor = [vtrqColor, vpmColor];
  const datasets = [{ data: props.data.datasets[0].data, backgroundColor }];
  const data = { ...props.data, datasets };

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
