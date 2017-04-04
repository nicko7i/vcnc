/* eslint-disable no-nested-ternary */
import React, { PropTypes } from 'react';
import spacing from 'material-ui/styles/spacing';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {material_ui, vcnc} from '../constants/muiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { darkWhite, lightWhite, grey900 } from 'material-ui/styles/colors';
import AppNavDrawer from './AppNavDrawer';
import ExternalEvents from '../containers/ExternalEvents';

const muiTheme = getMuiTheme(material_ui, vcnc);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
  root: {
    minHeight: 400,
  },
  content: {
    margin: spacing.desktopGutter,
  },
  footer: {
    backgroundColor: grey900,
    textAlign: 'center',
  },
  a: {
    color: darkWhite,
  },
  p: {
    margin: '0 auto',
    padding: 0,
    color: lightWhite,
    maxWidth: 356,
  },
  iconButton: {
    color: darkWhite,
  },
};

const AppFrame = (props, context) => {
    const {
      location,
      children,
      navDrawerOpen,
      openOrCloseNavDrawer,
    } = props;

    const router = context.router;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <ExternalEvents />
          <div style={styles.root}>
            {children}
          </div>
          <AppNavDrawer
            location={location}
            docked={false}
            onRequestChangeNavDrawer={openOrCloseNavDrawer}
            onChangeList={(event, value) => {
              router.push(value);
              openOrCloseNavDrawer(false);
            }}
            open={navDrawerOpen}
          />
        </div>
      </MuiThemeProvider>
    );
};

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
  navDrawerOpen: PropTypes.bool.isRequired,
  openOrCloseNavDrawer: PropTypes.func.isRequired,
};

AppFrame.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default AppFrame;
