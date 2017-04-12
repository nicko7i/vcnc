/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const config = require('./configuration');
const r = require('rethinkdb');

const tableName = 'dashboard';
let cnxtn = null;

/**
 *  Initializes the grid module, creating a connection object
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
    r.tableList().filter(v => v.eq(tableName)).run(cnxtn),
  )
  .then((lst) => {
    // Create the table if necessary.
    if (lst.length === 0) {
      return r.tableCreate(tableName).run(cnxtn);
    }
    return Promise.resolve();
  });
}

/**
 *  Creates a new grid job information entry.
 *
 *  @return {promise} A promise resolving to error status.
 */
function createEntry(data) {
  const value = (typeof data === 'string') ? data : JSON.stringify(data);
  return r.table(tableName).insert({
    data: value,
    timestamp: r.now(),
  }).run(cnxtn);
}

module.exports = {
  init,
  createEntry,
};
