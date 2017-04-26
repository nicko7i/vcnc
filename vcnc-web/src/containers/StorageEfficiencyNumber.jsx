import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import WidgetFrame from '../components/widgets/WidgetFrame';

const textStyle = {
  position: 'relative',
  float: 'left',
  fontWeight: 'bold',
  fontSize: '70pt',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

//
// Text centering solution from http://stackoverflow.com/a/25799339/7702839
const StorageEfficiencyNumber = props => (
  <WidgetFrame title={props.title}>
    <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'relative' }}>
      <div style={{ width: '100%', height: props.muiTheme.dashboard.canvasHeight, position: 'absolute' }}>
        <div style={textStyle} >
          {props.value.toFixed(1)}
        </div>
      </div>
    </div>
  </WidgetFrame>
);


StorageEfficiencyNumber.propTypes = {
  canvasHeight: PropTypes.string,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
};

function mapStateToProps(state) {
  return {
    value: state.realtime.storageEfficiency,
  };
}

export default muiThemeable()(connect(
  mapStateToProps,
)(StorageEfficiencyNumber));

