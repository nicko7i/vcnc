import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/appActions';
import AppFrame from '../components/AppFrame';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
export const App = props => (
  <AppFrame
    location={props.location}
    navDrawerOpen={props.navDrawerOpen}
    openOrCloseNavDrawer={props.actions.openOrCloseNavDrawer}
    toggleNavDrawer={props.actions.toggleNavDrawer}
  >
    {props.children}
  </AppFrame>
);

App.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  navDrawerOpen: PropTypes.bool.isRequired,
  openOrCloseNavDrawer: PropTypes.func,
  toggleNavDrawer: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    location: { pathname: '/not/currently/used' },
    navDrawerOpen: state.app.navDrawerOpen,
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
)(App);
