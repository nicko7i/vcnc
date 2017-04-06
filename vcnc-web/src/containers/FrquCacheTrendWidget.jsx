import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as actions from '../actions/realtimeActions';
import FrquCacheTrend from '../components/FrquCacheTrend';

const FrquCacheTrendWidget = (props) => {
  //  merge the data for the lines (which comes in through 'state' with
  //  the themed colors for their display (which comes in through props).
  const colors = [
    props.muiTheme.palette.vtrqColor,
    props.muiTheme.palette.vpmColor,
    props.muiTheme.palette.vpColor,
  ];
  return (
    <FrquCacheTrend
      lines={props.lines.map((e, i) => (
        { ...e, color: colors[i] }
      ))}
    />
  );
};


FrquCacheTrendWidget.propTypes = {
  lines: PropTypes.array,
  muiTheme: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    lines: [
      { label: 'vTRQ', data: state.realtime.rVtrqTrend },
      { label: 'vPM', data: state.realtime.rVpmTrend },
      { label: 'VP', data: state.realtime.rVpTrend },
    ],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default muiThemeable()(connect(
  mapStateToProps,
  mapDispatchToProps,
)(FrquCacheTrendWidget));

