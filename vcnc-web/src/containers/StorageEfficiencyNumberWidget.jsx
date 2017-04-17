import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const StorageEfficiencyNumberWidget = props => (
  <h1>{props.value}</h1>
);

StorageEfficiencyNumberWidget.propTypes = {
  value: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    value: state.realtime.storageEfficiency,
  };
}

export default connect(
  mapStateToProps,
)(StorageEfficiencyNumberWidget);

