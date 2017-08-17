/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
// const json = require('JSON');
const r = require('rethinkdb');
const conf = require('./vcncSampler.conf');
//
const config = require('../../../vcnc-core/src/lib/configuration.js');
//
const tbl = conf.Table();
//
let cnxtn = null;
const dbName = config.rethinkdb.connection.db;

//
//  A watchdog barks (to console) if there have been no messages for one
//  minute.  The metaphor is: the watchdog barks if he hasn't been
//  fed for more than one minute.
//
let watchdogFed;
function feedWatchdog() {
  watchdogFed = true;
}
setInterval(
  () => {
    if (watchdogFed === undefined) return;
    if (!watchdogFed) {
      console.log('ERROR: No Push() to RethinkDB for at least 1 minute');
    } else {
      watchdogFed = false;
    }
  },
  60 * 1000);
//  End of watchdog code

function Trim(timespanSec) {
  return r.table(tbl)
  .filter(r.row('timestamp')
  .le(r.now().sub(timespanSec)))
  .delete({ durability: 'soft' }).run(cnxtn);
}

/**
 *  Initializes the vdaSampler module, creating a connection object
 *  and creating the table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function Init() {
//  return r.connect(config.rethinkdb.connection)
  return r.connect(config.rethinkdb.connection)
  .then((conn) => {
    cnxtn = conn;  // save the connection for later reuse
    return r.dbList().filter(v => v.eq(dbName)).run(conn);
  }, (e) => {
    console.error('ERROR: rethinkdb is not running');
    throw (e);
  })
  .then((lst) => {
    //  Create the database if necessary
    if (lst.length === 0) {
      return r.dbCreate(dbName).run(cnxtn)
      .then(() => r.tableCreate(tbl).run(cnxtn)
        .then(() => {
          r.table(tbl).indexCreate('timestamp').run(cnxtn);
        }));
    }
    return Promise.resolve();
  })
  .then(() =>
    //  Look for the table in the database
    r.tableList().filter(v => v.eq(tbl)).run(cnxtn))
  .then((lst) => {
    // Create the table if necessary.
    if (lst.length === 0) {
      // return r.tableCreate(table).indexCreate('timestamp').run(cnxtn);
      return r.tableCreate(tbl).run(cnxtn)
      .then(() => {
        r.table(tbl).indexCreate('timestamp').run(cnxtn);
      })
      .then(() => r.table(tbl).orderBy(r.desc('timestamp')).run(cnxtn));
    }
    return Promise.resolve();
  })
  .then(() => {
    r.db(dbName).wait().run(cnxtn);
  });
}
//
function GetConnection() {
  return cnxtn;
}
//
function GetTable() {
  return cnxtn;
}
//
function CloseConnection() {
  cnxtn.close({ noreplyWait: false });
}

function PushEmptyBin(entry) {
  const sample = Object.assign({}, entry);
  return r.table(tbl).insert(Object.assign({}, sample, { timestamp: r.now() })).run(cnxtn);
}
/**
 * Adds real time data for timepoint "now".
 *
 * @param entry - data bin
 */
function PushTestBin(entry) {
  const sample = Object.assign({}, entry);
  //
  feedWatchdog();
  return r.table(tbl).insert(
    Object.assign({}, sample, { timestamp: r.now() })).run(cnxtn);
}

module.exports = {
  GetConnection,
  GetTable,
  Init,
  Trim,
  CloseConnection,
  PushEmptyBin,
  PushTestBin,
};
