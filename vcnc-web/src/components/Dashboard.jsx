import React from 'react';
//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';
import FrquCacheDoughnutWidget from '../containers/FrquCacheDoughnutWidget';
import FrquCacheTrendWidget from '../containers/FrquCacheTrendWidget';
import StorageEfficiencyNumberWidget from '../containers/StorageEfficiencyNumberWidget';
import WidgetFrame from '../components/WidgetFrame';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <WidgetFrame title="Load Transfer Trend"> <FrquCacheTrendWidget /> </WidgetFrame>
      </div>
      <div className="col-xs-4">
        <WidgetFrame title="Load"> <FrquCacheDoughnutWidget /> </WidgetFrame>
      </div>
    </div>
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <WidgetFrame title="Efficiency Trend"> <FrquCacheTrendWidget /> </WidgetFrame>
      </div>
      <div className="col-xs-4">
        <WidgetFrame title="Efficiency"> <StorageEfficiencyNumberWidget /> </WidgetFrame>
      </div>
    </div>
  </div>
);

export default Dashboard;
