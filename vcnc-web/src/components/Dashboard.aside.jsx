import React from 'react';
// import { Grid, Col, Row } from 'react-bootstrap';
import { Container, Row, Col } from 'react-grid-system';
import 'bootstrap/dist/css/bootstrap.css';
import FrquCacheDoughnutWidget from '../containers/FrquCacheDoughnutWidget';
import FrquCacheTrendWidget from '../containers/FrquCacheTrendWidget';
import StorageEfficiencyNumberWidget from '../containers/StorageEfficiencyNumberWidget';
import WidgetFrame from '../components/WidgetFrame';

/*
const Dashboard = () => (
  <div className="container-fluid">
    <div className="row no-gutters equal" style={{ minHeight: '900px' }}>
      <div className="col-md-6" style={{ backgroundColor: 'orange' }}>
        <WidgetFrame title="Storage Efficiency"> <StorageEfficiencyNumberWidget /> </WidgetFrame>
      </div>
      <div className="col-md-3" style={{ backgroundColor: 'red' }}>
        <WidgetFrame title="Storage Efficiency"> <StorageEfficiencyNumberWidget /> </WidgetFrame>
      </div>
      <div className="col-md-3" style={{ backgroundColor: 'blue' }}>
        <WidgetFrame title="Storage Efficiency"> <StorageEfficiencyNumberWidget /> </WidgetFrame>
      </div>
    </div>
  </div>
);

*/
const canvasHeight = '25vh';
const Dashboard = () => (
  <Container fluid md >
    <Row>
      <Col md="{8}" style={{ backgroundColor: 'blue' }}>
        <WidgetFrame title="PeerCache Trend\n"> <FrquCacheTrendWidget canvasHeight={canvasHeight} /> </WidgetFrame>
      </Col>
      <Col md="{2}" style={{ backgroundColor: 'orange' }}>
        <WidgetFrame title="Performance"> <FrquCacheDoughnutWidget canvasHeight={canvasHeight} /> </WidgetFrame>
      </Col>
      <Col md="{2}" style={{ backgroundColor: 'orange' }}>
        <WidgetFrame title="Storage Efficiency"> <StorageEfficiencyNumberWidget canvasHeight={canvasHeight} /> </WidgetFrame>
      </Col>
    </Row>
  </Container>

);
export default Dashboard;
