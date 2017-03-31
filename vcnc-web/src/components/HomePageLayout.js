import React, {PropTypes} from 'react';
import PageBar from './PageBar';
import Dashboard from './Dashboard';

const HomePageLayout = props => {
  return (
    <div>
      <PageBar
        onMenuClick={props.onMenuClick}
        title={props.title}
      />
      <Dashboard />
    </div>
  );
};

HomePageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default HomePageLayout;

