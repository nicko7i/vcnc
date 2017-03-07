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
    zIndex: this.state.muiTheme.zIndex.appBar + 1,
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

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeRequestNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open,
    });
  };

  handleChangeList = (event, value) => {
    this.context.router.push(value);
    this.setState({
      navDrawerOpen: false,
    });
  };

  render() {
    const {
      location,
      children,
    } = this.props;

    let {
      navDrawerOpen,
    } = this.state;

    const router = this.context.router;
    const title =
      router.isActive('/settings') ? 'Settings' :
        router.isActive('/workspaces') ? 'Workspaces' : '';

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Title render="PeerCache" />
          <AppBar
            onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
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
            onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
            onChangeList={this.handleChangeList}
            open={navDrawerOpen}
          />
          <WorkspaceEditDialog />
        </div>
      </MuiThemeProvider>
    );
  }
}

/*
class App extends React.Component {
  render() {
    return (
      <div>
        <IndexLink to="/">Home</IndexLink>
        {' | '}
        <Link to="/fuel-savings">Demo App</Link>
        {' | '}
        <Link to="/about">About</Link>
        <br/>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

 */

AppFrame.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object.isReqired,
  navDrawerOpen: PropTypes.bool.isRequired,
};

AppFrame.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default AppFrame;
