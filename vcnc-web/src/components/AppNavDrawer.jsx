import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';
import CurrentVtrqSetter from '../containers/CurrentVtrqSetter';

const SelectableList = makeSelectable(List); // eslint-disable-line new-cap

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 10,
  },
  version: {
    paddingLeft: 16,
    fontSize: 16,
  },
};

const AppNavDrawer = (props, context) => {
  const {
    location,
    docked,
    onRequestChangeNavDrawer,
    onChangeList,
    open,
    style,
  } = props;

  function handleTouchTapHeader() {
    //
    //  Clicking the nav drawer header re-routes to the home screen.
    //  Clicking outside the drawer closes the drawer with non re-routing.
    //  Yes, this is a feature: it's the only way to get to the Home page.
    context.router.push('/');
    onRequestChangeNavDrawer(false);
  }

  return (
    <Drawer
      style={style}
      docked={docked}
      open={open}
      onRequestChange={onRequestChangeNavDrawer}
      containerStyle={{ zIndex: zIndex.drawer - 100 }}
    >
      <div style={styles.logo} onTouchTap={handleTouchTapHeader}>
        PeerCache
      </div>
      <SelectableList
        value={location.pathname}
        onChange={onChangeList}
      >
        <ListItem primaryText="Files" value="/files" />,
        <ListItem primaryText="Mounts" value="/mounts" />,
        <ListItem primaryText="Specialty" value="/se" />,
        <ListItem primaryText="Workspaces" value="/workspaces" />,
        <Divider />
        <Subheader>Settings</Subheader>
        <TextField
          hintText="vcnc:6300"
          style={{ paddingLeft: 16 }}
        />
        <CurrentVtrqSetter />
      </SelectableList>
    </Drawer>
  );
};

AppNavDrawer.propTypes = {
  docked: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  onChangeList: PropTypes.func.isRequired,
  onRequestChangeNavDrawer: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

AppNavDrawer.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default AppNavDrawer;
