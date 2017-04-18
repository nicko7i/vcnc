//
/* eslint-disable no-console */
const config = require('./configuration.js');
const url = require('url');
const mockDashboardData = require('./mockDashboardData')();
const mockSampler = require('./mockSampler');
const r = require('rethinkdb');

let connection = null;

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

function init() {
  return r.connect(config.rethinkdb.connection)
  .then((conn) => {
    connection = conn;
  });
}

function makeMockRethinkHandler() {
  let changeCursor = null;
  return (ws) => {
    const location = url.parse(ws.upgradeReq.url, true);
    console.log('INFO-WS: Connected from ', location);
    //
    //  Start things off by blasting the 100 most recent timepoints.
    //
    mockSampler.getTable()
    .orderBy({ index: r.desc('timestamp') })
    .limit(100)
    .orderBy('timestamp')
    .run(connection)
    .then((cursor) => {
      cursor.each((err, entry) => {
        const { rVpm, rVtrq, storageEfficiency } = entry;
        ws.send(JSON.stringify({ rVpm, rVtrq, storageEfficiency }));
      });
    });
    //
    //  Subscribe to changes in the RethinkDB dashboard table.
    //
    mockSampler.getTable()
    .changes()
    .run(connection, (err, cursor) => {
      changeCursor = cursor;
      cursor.each((error, change) => {
        if (change !== undefined && change.new_val) {
          const { rVpm, rVtrq, storageEfficiency } = change.new_val;
          ws.send(JSON.stringify({ rVpm, rVtrq, storageEfficiency }));
        }
      });
    })
    .catch(() => console.log('caught cursor error'));

    ws.on('open', () => {
      console.log('INFO-WS: opened');
    });

    ws.on('message', (message) => {
      console.log('INFO-ws: received: %s', message);
    });

    ws.on('close', () => {
      console.log('INFO-ws: disconnected');
      changeCursor.close();
    });
  };
}

module.exports = {
  init,
  makeMockRethinkHandler,
  makeMockHandler,
  makeHandler: makeMockRethinkHandler,
};
