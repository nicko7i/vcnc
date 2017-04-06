import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/settingsActions';
import VtrqSetter from '../components/VtrqSetter';

const CurrentVtrqSetter = props => (
  <VtrqSetter
    value={props.currentVtrq}
    onChange={(event, index, val) => props.actions.setCurrentVtrq(val)}
    style={{ width: 181 }}
  />
);

CurrentVtrqSetter.propTypes = {
  actions: PropTypes.object,
  currentVtrq: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    currentVtrq: state.settings.currentVtrq,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentVtrqSetter);
