import React from 'react';
import PropTypes from 'prop-types';
import PageBar from './PageBar';
import Dashboard from './Dashboard';

const HomePageLayout = props => (
  <div>
    <PageBar
      onMenuClick={props.onMenuClick}
      title={props.title}
    />
    <Dashboard />
  </div>
);

HomePageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default HomePageLayout;


