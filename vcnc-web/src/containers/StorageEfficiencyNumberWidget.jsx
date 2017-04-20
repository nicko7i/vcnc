import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const myStyle = {
  fontWeight: 'bold',
  fontSize: 64,
  margin: 50,
  height: '100%',
  width: '100%',
};

const StorageEfficiencyNumberWidget = props => (
  <div style={myStyle}>{props.value.toFixed(1)}</div>
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

