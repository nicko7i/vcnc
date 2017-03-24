import React, {PropTypes} from 'react';
import PageBar from './PageBar';
import Dashboard from 'react-dazzle';
import FrquCacheDoughnut from '../containers/FrquCacheDoughnut';

//  default Dazzle styles, at least for now...
import 'react-dazzle/lib/style/style.css';

const widgets = {
  FrquTrend: {
    type: FrquCacheDoughnut,
    title: 'Counter widget',
  }
};

const layout = {
  rows: [{
    columns: [{
      className: 'col-md-12',
      widgets: [{key: 'FrquTrend'}],
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
      <Dashboard widgets={widgets} layout={layout} />
    </div>
  );
};

HomePageLayout.propTypes = {
  onMenuClick: PropTypes.func,
  title: PropTypes.string,
};

export default HomePageLayout;

