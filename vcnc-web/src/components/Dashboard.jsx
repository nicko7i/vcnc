import React from 'react';
//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';
import FrquCacheDoughnutWidget from '../containers/FrquCacheDoughnutWidget';
import FrquCacheTrendWidget from '../containers/FrquCacheTrendWidget';
import StorageEfficiencyNumberWidget from '../containers/StorageEfficiencyNumberWidget';
import WidgetFrame from '../components/WidgetFrame';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="row no-gutters row-equal-height" >
      <div className="col-md-8">
        <WidgetFrame title="PeerCache Trend"> <FrquCacheTrendWidget /> </WidgetFrame>
      </div>
      <div className="col-md-2">
        <WidgetFrame title="Performance"> <FrquCacheDoughnutWidget /> </WidgetFrame>
      </div>
      <div className="col-md-2">
        <WidgetFrame title="Efficiency"> <StorageEfficiencyNumberWidget /> </WidgetFrame>
      </div>
    </div>
  </div>
);

export default Dashboard;
