//
/* eslint-disable no-console */
const config = require('./configuration.js');
const url = require('url');
const mockDashboardData = require('./mockDashboardData')();
const r = require('rethinkdb');

const samplerTableName = config.vcncSampler.table;

let connection = null;

//  Useful for unit testing??
function makeMockHandler() {
  let interval = null;
  return (ws) => {
    const location = url.parse(ws.upgradeReq.url, true);
    console.log('INFO-WS: Connected from ', location);

    ws.on('open', () => {
      console.log('INFO-WS: opened');
    });

    ws.on('message', (message) => {
      console.log('INFO-WS: received: %s', message);
    });

    ws.on('close', () => {
      console.log('INFO-WS: disconnected');
      clearInterval(interval);
    });

    interval = setInterval(() => {
      ws.send(JSON.stringify(mockDashboardData()));
      feedWatchdog();
    }, 10000);
  };
}

function init() {
  return r.connect(config.rethinkdb.connection)
  .then((conn) => {
    connection = conn;
  });
  //
  //  We don't try to create a table.  If one isn't there, it's
  //  an error.  This might be an issue: in systemd, we might
  //  need to start vcnc-sampler first, wait a few seconds,
  //  and then start vcnc-rest (ugh)  Or something better.
}

function makeHandler() {
  let changeCursor = null;
  return (ws) => {
    const location = url.parse(ws.upgradeReq.url, true);
    console.log('INFO-WS: Connected from ', location);
    //
    //  A watchdog barks (to console) if there have been no messages for one
    //  minute.  The metaphor is: the watchdog barks if he hasn't been
    //  fed for more than one minute.
    //
    let watchdogFed = undefined;
    function feedWatchdog() {
      watchdogFed = true;
    }
    const interval = setInterval(
      () => {
        if (watchdogFed !== undefined && !watchdogFed) {
          console.log('ERROR: No RethinkDB post for at least 1 minute')
        }
        watchdogFed = false;
      },
      60*1000);
    //
    //  Start things off by blasting the 100 most recent timepoints.
    //
    r.table(samplerTableName)
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
    r.table(samplerTableName)
    .changes()
    .run(connection, (err, cursor) => {
      changeCursor = cursor;
      cursor.each((error, change) => {
        if (change !== undefined && change.new_val) {
          const { rVpm, rVtrq, storageEfficiency } = change.new_val;
          ws.send(JSON.stringify({ rVpm, rVtrq, storageEfficiency }));
          feedWatchdog();
        }
      });
    })
    .catch(() => console.log('ERROR: caught RethinkDB cursor error'));

    ws.on('open', () => {
      console.log('INFO-WS: opened');
    });

    ws.on('message', (message) => {
      console.log('INFO-WS: received: %s', message);
    });

    ws.on('close', () => {
      console.log('INFO-WS: disconnected');
      changeCursor.close();
      clearInterval(interval)
    });
  };
}

module.exports = {
  init,
  makeMockHandler,
  makeHandler,
};
