import React, {PropTypes} from 'react';
import PageBar from './PageBar';
import Dashboard from 'react-dazzle';
import FrquCacheDoughnut from '../containers/FrquCacheDoughnut';
import FrquCacheTrend from '../containers/FrquCacheTrend';

//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';

//  default Dazzle styles, at least for now...
import 'react-dazzle/lib/style/style.css';

const widgets = {
  FrquDoughnut: {
    type: FrquCacheDoughnut,
    title: 'Cache Performance',
  },
  FrquTrend: {
    type: FrquCacheTrend,
    title: 'Cache Trend',
  },
  ZtsDoughnut: {
    type: FrquCacheDoughnut,
    title: 'Zts Performance',
  },
  ZtsTrend: {
    type: FrquCacheTrend,
    title: 'Zts Trend',
  },
};

const layout = {
  /*
  rows: [{
    columns: [{
      className: 'col-md-12 col-sm-6 col-xs-12',
      widgets: [{ key: 'FrquTrend'}],
    },{
      className: 'col-md-12 col-sm-6 col-xs-12',
      widgets: [{key: 'FrquDoughnut'}],
    }],
  }],
  */
  rows: [
    { columns: [
      { className: 'col-md-6', widgets: [{ key: 'FrquTrend' }] },
      { className: 'col-md-6', widgets: [{ key: 'FrquDoughnut' }] }]
    },
    { columns: [
      { className: 'col-md-6', widgets: [{ key: 'ZtsTrend' }] },
      { className: 'col-md-6', widgets: [{ key: 'ZtsDoughnut' }] }]
    },
  ]
  /*
  rows: [
    { columns: [{ className: 'col-md-6', widgets: [{ key: 'FrquTrend' }] }]},
    { columns: [{ className: 'col-md-6', widgets: [{ key: 'FrquDoughnut' }] }]},
  ]
  */
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

