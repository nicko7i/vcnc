import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as actions from '../actions/realtimeActions';
import FrquCacheTrendWidget from '../components/widgets/FrquCacheTrendWidget';

const FrquCacheTrend = (props) => {
  //  merge the data for the lines (which comes in through 'state' with
  //  the themed colors for their display (which comes in through props).
  const colors = [
    props.muiTheme.palette.vtrqColor,
    props.muiTheme.palette.vpmColor,
    props.muiTheme.palette.vpColor,
  ];
  return (
    <FrquCacheTrendWidget
      lines={props.lines.map((e, i) => (
        { ...e, color: colors[i] }
      ))}
      title={props.title}
    />
  );
};


FrquCacheTrend.propTypes = {
  lines: PropTypes.array,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
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
)(FrquCacheTrend));

