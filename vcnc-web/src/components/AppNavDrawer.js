/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import CurrentVtrqSetter from './CurrentVtrqSetter';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

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

class AppNavDrawer extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTouchTapHeader = this.handleTouchTapHeader.bind(this);
  }

  handleTouchTapHeader() {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  }

  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
    } = this.props;

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          PeerCache
        </div>
        <span style={styles.version}>vTRQ:</span>
        <CurrentVtrqSetter />
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          <ListItem primaryText="Workspaces" value="/workspaces" />,
        </SelectableList>
      </Drawer>
    );
  }
}

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
