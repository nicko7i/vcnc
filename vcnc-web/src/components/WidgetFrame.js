import React, {PropTypes} from 'react';
import {Card, CardHeader} from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
  card: {
    marginTop: '15px',
    marginBottom: '15px',
    /*
    marginLeft: '30px',
    marginRight: '0px',
    paddingLeft: '15px',
    paddingRight: '15px',
    */
    // margin: '20',
    // padding: '15px 10px 10px 15px',
  },

};

const WidgetFrame = props => {
  const backgroundColor = props.muiTheme.palette.accent3Color;
  const titleColor = props.muiTheme.palette.alternateTextColor;
  const {
    title,
    children
  } = props;
  return (
    <Card style={styles.card}>
      <CardHeader style={{backgroundColor}} title={title} titleColor={titleColor} />
      {children}
    </Card>
  );
};

WidgetFrame.propTypes = {
  children: PropTypes.node,
  muiTheme: PropTypes.object,
  title: PropTypes.string,
};

export default muiThemeable()(WidgetFrame);
