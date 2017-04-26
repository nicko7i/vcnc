import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import NumberWidget from '../components/widgets/NumberWidget';

const StorageEfficiencyNumber = props => (
  <NumberWidget title={props.title} value={props.value} digits={1} fontSize="15vw" />
);


StorageEfficiencyNumber.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    value: state.realtime.storageEfficiency,
  };
}

export default muiThemeable()(connect(
  mapStateToProps,
)(StorageEfficiencyNumber));

