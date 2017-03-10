import React, {PropTypes} from 'react';
import PageBar from './PageBar';

const HomePageLayout = props => {
  return (
    <div>
      <PageBar
        onMenuClick={props.onMenuClick}
        title={props.title}
      />
      <div style={{ textAlign: 'center'}}>
        <h1>PeerCache</h1>
      </div>
    </div>
  );
};

HomePageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default HomePageLayout;

