import React, {PropTypes} from 'react';
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
