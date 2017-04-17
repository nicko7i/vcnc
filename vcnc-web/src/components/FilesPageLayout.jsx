import React from 'react';
import PropTypes from 'prop-types';
import PageBar from './PageBar';

const FilesPageLayout = props => (
  <PageBar
    onMenuClick={props.onMenuClick}
    title={props.title}
  />
);

FilesPageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default FilesPageLayout;

