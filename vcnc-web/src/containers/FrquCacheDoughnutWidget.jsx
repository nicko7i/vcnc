import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FrquCacheDoughnut from '../components/FrquCacheDoughnut';

const FrquCacheDoughnutWidget = props => (
  <FrquCacheDoughnut data={props.data} />
);

FrquCacheDoughnutWidget.propTypes = {
  data: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    data: [
      state.realtime.rVtrq,
      state.realtime.rVpm,
      state.realtime.rVp,
    ],
  };
}

export default connect(
  mapStateToProps,
)(FrquCacheDoughnutWidget);
