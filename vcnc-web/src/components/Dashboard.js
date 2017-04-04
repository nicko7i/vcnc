import React, {PropTypes} from 'react';
import FrquCacheDoughnutWidget from '../containers/FrquCacheDoughnutWidget';
import FrquCacheTrendWidget from '../containers/FrquCacheTrendWidget';
import WidgetFrame from '../components/WidgetFrame';

//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row no-gutters row-equal-height">
        <div className="col-md-6">
          <WidgetFrame title="PeerCache Trend"> <FrquCacheTrendWidget /> </WidgetFrame>
        </div>
        <div className="col-md-6">
          <WidgetFrame title="PeerCache Performance"> <FrquCacheDoughnutWidget /> </WidgetFrame>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;