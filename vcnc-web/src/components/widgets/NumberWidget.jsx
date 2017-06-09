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

const fontSize = value => {
  //
  //  CSS lets you express "percentage of the viewport width" but not
  //  "percentage of the width of the enclosing <div>".
  //
  //  What we are doing here is unsatisfactory.  We are making
  //  assumptions about the layout of the grid in the viewport.
  //
  //  Two digits and a decimal point fit when the font size is 15% of
  //  the viewport width ('15vw'). This calculation makes the font size smaller
  //  by log10(value) in a way that keeps the number inside the box
  //  while remaining as readable as possible.
  //
  //  This is enough for DAC and enough for the range of values we're
  //  currently using, but it should be generalized.  There's also an
  //  argument that all this should be done in the caller.
  //
  const digitCount = Math.floor(Math.log10(Math.abs(value))) + 1;
  if (digitCount < 2) return `15vw`;
  if (digitCount < 3) return `11vw`;
  if (digitCount < 4) return `9vw`;
  return '40pt';
}

//
// Text centering solution from http://stackoverflow.com/a/25799339/7702839
const NumberWidget = props => (
  <WidgetFrame title={props.title}>
    <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'relative' }}>
      <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'absolute' }}>
        <div style={{ ...textStyle, color: props.color, fontSize: fontSize(props.value) }} >
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

