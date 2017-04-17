import React from 'react';
import PropTypes from 'prop-types';
import PageBar from './PageBar';

const MountsPageLayout = props => (
  <PageBar
    onMenuClick={props.onMenuClick}
    title={props.title}
  />
);

MountsPageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default MountsPageLayout;

