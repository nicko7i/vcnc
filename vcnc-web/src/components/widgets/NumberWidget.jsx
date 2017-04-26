import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import WidgetFrame from './WidgetFrame';

const textStyle = {
  position: 'relative',
  color: 'pink',
  float: 'left',
  fontWeight: 'bold',
  fontSize: '15vw',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

//
// Text centering solution from http://stackoverflow.com/a/25799339/7702839
const NumberWidget = props => (
  <WidgetFrame title={props.title}>
    <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'relative' }}>
      <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'absolute' }}>
        <div style={{ ...textStyle, color: props.color, fontSize: props.fontSize }} >
          {props.value.toFixed(props.digits)}
        </div>
      </div>
    </div>
  </WidgetFrame>
);


NumberWidget.propTypes = {
  canvasHeight: PropTypes.string,
  color: PropTypes.string,
  digits: PropTypes.number,
  fontSize: PropTypes.string,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};


export default muiThemeable()(NumberWidget);

