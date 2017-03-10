import React, {PropTypes} from 'react';
import PageBar from './PageBar';

const MountsPageLayout = props => {
  return (
    <PageBar
      onMenuClick={props.onMenuClick}
      title={props.title}
    />
  );
};

MountsPageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default MountsPageLayout;
