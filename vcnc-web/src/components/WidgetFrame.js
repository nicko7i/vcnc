import React, {PropTypes} from 'react';
import {Card, CardHeader} from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';

const WidgetFrame = props => {
  const {backgroundColor, titleColor, styles} = props.muiTheme.widgetFrame;
  const {
    title,
    children
  } = props;
  return (
    <Card style={styles}>
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
