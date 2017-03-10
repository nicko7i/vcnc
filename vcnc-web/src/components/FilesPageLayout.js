import React, {PropTypes} from 'react';
import PageBar from './PageBar';

const FilesPageLayout = props => {
  return (
    <PageBar
      onMenuClick={props.onMenuClick}
      title={props.title}
    />
  );
};

FilesPageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default FilesPageLayout;
