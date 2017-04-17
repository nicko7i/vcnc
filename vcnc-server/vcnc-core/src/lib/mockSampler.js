/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
const config = require('./configuration.js');
const r = require('rethinkdb');
const mockDashBoardData = require('./mockDashboardData')();

let cnxtn = null;
const { table, maxEntries } = config.mockSampler;

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
      return r.tableCreate(table).run(cnxtn);
    }
    return Promise.resolve();
  });
}

function push(entry) {
  return r.table(table).insert(
    Object.assign({}, entry, { timestamp: r.now() })
  ).run(cnxtn)
  .then(() => r.table(table).count().run(cnxtn))
  .then((size) => {
    //
    //  Reduce the size of the table when it grows to twice its desired size.
    //  This is pretty silly.  We won't actually do this.  Instead,
    //  we'll have a table that acts like a ring buffer. Or something else.
    if (size > maxEntries * 2) {
      return r.table(table)
      .orderBy(r.asc('timestamp'))
      .limit(maxEntries)
      .delete({ durability: 'soft' })
      .run(cnxtn);
    }
    return Promise.resolve();
  });
}

function run(period) {
  return () => setInterval(() => push(mockDashBoardData()), period);
}

module.exports = {
  init,
  run,
};
