/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
const config = require('./configuration.js');
const r = require('rethinkdb');
const mockDashBoardData = require('./mockDashboardData')();

let cnxtn = null;
const { table, maxEntries, period } = config.mockSampler;
const timespanMillisec = maxEntries * period;
const timespanSec = timespanMillisec / 1000.0;

/**
 *  Initializes the mockSampler module, creating a connection object
 *  and creating the table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function init() {
  return r.connect(config.rethinkdb.connection)
  .then((conn) => {
    cnxtn = conn;  // save the connection for later reuse
  })
  .then(() =>
    //  Look for the table in the database
    r.tableList().filter(v => v.eq(table)).run(cnxtn)
  )
  .then((lst) => {
    // Create the table if necessary.
    if (lst.length === 0) {
      return r.tableCreate(table).indexCreate('timestamp').run(cnxtn);
    }
    return Promise.resolve();
  });
}

/**
 * Adds real time data for timepoint "now".
 *
 * @param entry
 * @returns {Promise.<TResult>|*|Request}
 *
 * The table is trimmed to size with every entry. This is unnecessarily
 * computational. It's probably better to trim periodically in the background.
 */
function push(entry) {
  return r.table(table).insert(
    Object.assign({}, entry, { timestamp: r.now() })
  ).run(cnxtn);
}

function trim() {
  return r.table(table)
  .filter(r.row('timestamp')
  .le(r.now().sub(timespanSec)))
  .delete({ durability: 'soft' }).run(cnxtn);
}

/**
 * Runs the mock data simulation.
 *
 * @returns {function(): number}
 */
function run() {
  setInterval(() => push(mockDashBoardData()), period);
  setInterval(() => trim(), timespanMillisec);
}

module.exports = {
  init,
  run,
};
