/* eslint-disable no-nested-ternary */
import React, { PropTypes } from 'react';
import Title from 'react-title-component';
import AppBar from 'material-ui/AppBar';
import spacing from 'material-ui/styles/spacing';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { darkWhite, lightWhite, grey900 } from 'material-ui/styles/colors';
import AppNavDrawer from './AppNavDrawer';

const muiTheme = getMuiTheme();

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const styles = {
  appBar: {
    position: 'fixed',
    // Needed to overlap the examples
    zIndex: muiTheme.zIndex.appBar + 1,
    top: 0,
  },
  root: {
    paddingTop: spacing.desktopKeylineIncrement,
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

class AppFrame extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      location,
      children,
      navDrawerOpen,
      openOrCloseNavDrawer,
      toggleNavDrawer,
    } = this.props;

    const router = this.context.router;
    const title =
      router.isActive('/settings') ? 'Settings' :
        router.isActive('/workspaces') ? 'Workspaces' : 'TITLE';

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Title render="PeerCache" />
          <AppBar
            onLeftIconButtonTouchTap={toggleNavDrawer}
            title={title}
            zDepth={0}
            style={styles.appBar}
          />
          <div style={styles.root}>
            {children}
          </div>
          <AppNavDrawer
            location={location}
            docked={false}
            onRequestChangeNavDrawer={openOrCloseNavDrawer}
            onChangeList={(event, value) => {
              this.context.router.push(value);
              openOrCloseNavDrawer(false);
            }}
            open={navDrawerOpen}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object,
  navDrawerOpen: PropTypes.bool.isRequired,
  openOrCloseNavDrawer: PropTypes.func.isRequired,
  toggleNavDrawer: PropTypes.func.isRequired,
};

AppFrame.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default AppFrame;
