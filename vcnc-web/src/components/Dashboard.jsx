import React from 'react';
//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';
import FrquCacheDoughnut from '../containers/FrquCacheDoughnut';
import FrquCacheTrend from '../containers/FrquCacheTrend';
import StorageEfficiencyNumber from '../containers/StorageEfficiencyNumber';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <FrquCacheTrend title="Load Transfer Trend" />
      </div>
      <div className="col-xs-4">
        <FrquCacheDoughnut title="Load" />
      </div>
    </div>
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <FrquCacheTrend title="Efficiency Trend" />
      </div>
      <div className="col-xs-4">
        <StorageEfficiencyNumber title="Efficiency" />
      </div>
    </div>
  </div>
);

export default Dashboard;
