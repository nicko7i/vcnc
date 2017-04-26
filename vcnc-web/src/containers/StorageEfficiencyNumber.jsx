import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import NumberWidget from '../components/widgets/NumberWidget';

const StorageEfficiencyNumber = props => (
  <NumberWidget
    title={props.title}
    value={props.value}
    digits={1}
    color={props.muiTheme.palette.storageEfficiencyColor}
    fontSize="15vw"
  />
);


StorageEfficiencyNumber.propTypes = {
  muiTheme: PropTypes.object,
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

