import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/appActions';
import HomePageLayout from '../components/HomePageLayout';

export const HomePage = props => (
  <HomePageLayout
    onMenuClick={props.actions.toggleNavDrawer}
    title="PeerCache"
  />
);

HomePage.propTypes = {
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(/* state */) {
  return {
    // intentionally empty, for now
  };
}

function mapDispatchToProps(dispatch) {
  const rtn = {
    actions: bindActionCreators(appActions, dispatch),
  };
  return rtn;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);

