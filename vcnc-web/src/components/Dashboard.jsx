import React from 'react';
//  Using bootstrap to produce the grid
import 'bootstrap/dist/css/bootstrap.css';
import VtrqVpmReadDoughnut from '../containers/VtrqVpmReadDoughnut';
import VtrqVpmReadTrend from '../containers/VtrqVpmReadTrend';
import StorageEfficiencyTrend from '../containers/StorageEfficiencyTrend';
import StorageEfficiencyNumber from '../containers/StorageEfficiencyNumber';

const Dashboard = () => (
  <div className="container-fluid">
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <VtrqVpmReadTrend title="Load Transfer Trend" />
      </div>
      <div className="col-xs-4">
        <VtrqVpmReadDoughnut title="Load" />
      </div>
    </div>
    <div className="row no-gutters" >
      <div className="col-xs-8">
        <StorageEfficiencyTrend title="Efficiency Trend" />
      </div>
      <div className="col-xs-4">
        <StorageEfficiencyNumber title="Efficiency" />
      </div>
    </div>
  </div>
);

export default Dashboard;
