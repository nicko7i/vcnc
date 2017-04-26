import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FrquCacheDoughnutWidget from '../components/widgets/FrquCacheDoughnutWidget';

const FrquCacheDoughnut = props => (
  <FrquCacheDoughnutWidget data={props.data} title={props.title} />
);

FrquCacheDoughnut.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string.isRequired,
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
)(FrquCacheDoughnut);
