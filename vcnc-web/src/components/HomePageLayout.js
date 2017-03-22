import React, {PropTypes} from 'react';
import PageBar from './PageBar';
import Dashboard from 'react-dazzle';
import FrquCacheTrend from '../containers/FrquCacheTrend';

//  default Dazzle styles, at least for now...
import 'react-dazzle/lib/style/style.css';

const widgets = {
  WordCounter: {
    type: FrquCacheTrend,
    title: 'Counter widget',
  }
};

const layout = {
  rows: [{
    columns: [{
      className: 'col-md-12',
      widgets: [{key: 'WordCounter'}],
    }],
  }],
};

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
      <Dashboard widgets={widgets} layout={layout} />
    </div>
  );
};

HomePageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default HomePageLayout;

