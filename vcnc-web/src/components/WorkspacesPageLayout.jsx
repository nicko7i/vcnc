import React from 'react';
import PropTypes from 'prop-types';
import PageBar from './PageBar';

const WorkspacesPageLayout = props => {
  return (
    <PageBar
      onMenuClick={props.onMenuClick}
      title={'Workspaces'}
    />
  );
};

WorkspacesPageLayout.propTypes = {
  onMenuClick: PropTypes.func,
};

export default WorkspacesPageLayout;
