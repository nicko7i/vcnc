import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as actions from '../actions/realtimeActions';
import TrendWidget from '../components/widgets/TrendWidget';

const labels = [
  '-2 min', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '-1 min', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', 'now',
];

const VtrqVpmReadTrend = (props) => {
  //  merge the data for the lines (which comes in through 'state' with
  //  the themed colors for their display (which comes in through props).
  const colors = [
    props.muiTheme.palette.vtrqColor,
    props.muiTheme.palette.vpmColor,
  ];
  return (
    <TrendWidget
      labels={labels}
      lines={props.lines.map((e, i) => (
        { ...e, color: colors[i] }
      ))}
      title={props.title}
    />
  );
};


VtrqVpmReadTrend.propTypes = {
  lines: PropTypes.array,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lines: [
      { label: 'vTRQ', data: state.realtime.rVtrqTrend },
      { label: 'vPM', data: state.realtime.rVpmTrend },
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
)(VtrqVpmReadTrend));

