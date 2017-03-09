import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';

//  muiThemeable() doesn't work with functional components.
class PageBar extends React.Component {
  render() {
    const {
      muiTheme,
      onMenuClick,
      title,
    } = this.props;

    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: muiTheme.zIndex.appBar + 1,
        top: 0,
      },
    };

    return (
      <AppBar
        onLeftIconButtonTouchTap={onMenuClick}
        title={title}
        zDepth={0}
        style={styles}
      />
    );
  }
}

PageBar.propTypes = {
  muiTheme: PropTypes.object,
  onMenuClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default muiThemeable()(PageBar);
