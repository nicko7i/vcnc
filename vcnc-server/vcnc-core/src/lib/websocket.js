//
/* eslint-disable no-console */
const url = require('url');
const mockDashboardData = require('./mockDashboardData')();

function makeHandler() {
  let interval = null;
  return (ws) => {
    const location = url.parse(ws.upgradeReq.url, true);
    console.log('INFO-WS: Connected from ', location);

    ws.on('open', () => {
      console.log('INFO-WS: opened');
    });

    ws.on('message', (message) => {
      console.log('INFO-ws: received: %s', message);
    });

    ws.on('close', () => {
      console.log('INFO-ws: disconnected');
      clearInterval(interval);
    });

    interval = setInterval(() => {
      ws.send(JSON.stringify(mockDashboardData()));
    }, 10000);
  };
}

module.exports = {
  makeHandler,
};
