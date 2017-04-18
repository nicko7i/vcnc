//
/* eslint-disable no-console */
const url = require('url');
const mockDashboardData = require('./mockDashboardData')();
const mockSampler = require('./mockSampler');
const r = require('rethinkdb');

function makeMockHandler() {
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

function makeMockRethinkHandler() {
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
      // clearInterval(interval);
    });
    //
    //  Subscribe to changes in the RethinkDB dashboard table.
    //
    mockSampler.getTable()
    // .orderBy({ index: r.desc('timepoint') })
    // .limit(10)
    .changes()
    .run(mockSampler.getConnection(), (err, cursor) => {
      // cursor.each((e, y) => console.log(y));
      cursor.each((error, change) => {
        if (change.new_val) {
          const { rVpm, rVtrq, storageEfficiency } = change.new_val;
          ws.send(JSON.stringify({ rVpm, rVtrq, storageEfficiency }));
        }
      });
    });
  };
}

module.exports = {
  makeMockRethinkHandler,
  makeMockHandler,
  makeHandler: makeMockRethinkHandler,
};
