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

const VtrqStatsTrend = (props) => {
  //  merge the data for the lines (which comes in through 'state' with
  //  the themed colors for their display (which comes in through props).
  const colors = [
    props.muiTheme.palette.sumExtentsColor,
    props.muiTheme.palette.sumStSizeColor,
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


VtrqStatsTrend.propTypes = {
  lines: PropTypes.array,
  muiTheme: PropTypes.object,
  title: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    lines: [
      { label: 'extents', data: state.realtime.sumExtentsTrend },
      { label: 'st_size', data: state.realtime.sumStSizeTrend },
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
)(VtrqStatsTrend));

