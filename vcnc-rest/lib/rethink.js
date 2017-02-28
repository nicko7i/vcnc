/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
'use strict'; // eslint-disable-line strict
const config = require('./configuration.js');
const r = require('rethinkdb');
const dbName = config.rethinkdb.connection.db;
const tableName = 'about';
let cnxtn = null;

const schemaMajor = 1;
const schemaMinor = 0;

function newAboutRow() {
  return r.table(tableName).insert({
    schemaMajor,
    schemaMinor,
    timestamp: r.now()
  }).run(cnxtn);
}

/**
 *  Initializes the rethinkdb module, creating a connection object
 *  and creating the database if necessary.
 *
 *  Must be called before any other rethinkdb related module.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function init() {
  if (!config.test.enable_grid_jobs) return Promise.resolve();
  return r.connect(config.rethinkdb.connection)
  .then(conn => {
    cnxtn = conn;  // save the connection for later reuse
    return r.dbList().filter(v => v.eq(dbName)).run(conn);
  })
  .then(lst => {
    //  Create the database if necessary.
    if (lst.length === 0) {
      return r.dbCreate(dbName).run(cnxtn);
    }
    return Promise.resolve();
  })
  .then(() =>
    //  Look for the table in the database
    r.tableList().filter(v => v.eq(tableName)).run(cnxtn)
  )
  .then(lst => {
    // Create the table if necessary.
    if (lst.length === 0) {
      return r.tableCreate(tableName).run(cnxtn);
    }
    return Promise.resolve();
  })
  .then(() => r.table(tableName).orderBy(r.desc('timestamp')).limit(1).run(cnxtn))
  .then(lst => {
    if (lst.length === 0) {
      // Create the row
      return newAboutRow();
    } else {
      //
      //  Check the major rev number
      if (lst[0].schemaMajor !== schemaMajor) {
        return Promise.reject(
          `rethink.js: db major rev ${lst[0].schemaMajor} does not match server rev ${schemaMajor}`);
      }
      //
      //  Check the minor rev number
      if (lst[0].schemaMinor === schemaMinor) {
        return Promise.resolve();
      }
      if (lst[0].schemaMinor > schemaMinor) {
        //
        //  The database is newer than this code
        return Promise.reject(
          `rethink.js: db minor rev ${lst[0].schemaMinor} newer than server rev ${schemaMinor}`);
      }
      //
      //  We are a newer minor rev than this database.
      return newAboutRow();
    }
  });
}

module.exports = {
  init,
};
