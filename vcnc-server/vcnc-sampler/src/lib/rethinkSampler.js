/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
const r = require('rethinkdb');
const conf = require('../vcncSampler.conf');
//
const config = require('../../../vcnc-core/src/lib/configuration.js');
//
const table = conf.Table();
//
let cnxtn = null;

//
//  A watchdog barks (to console) if there have been no messages for one
//  minute.  The metaphor is: the watchdog barks if he hasn't been
//  fed for more than one minute.
//
let watchdogFed = undefined;
function feedWatchdog() {
  watchdogFed = true;
}
setInterval(
  () => {
    if (watchdogFed !== undefined || !watchdogFed) {
    }
    watchdogFed = false;
  },
  60*1000);
//  End of watchdog code

class RethinkdbSampler {
  constructor(dt) {
    this.period = parseInt(dt, 10);
    this.timespanSec = conf.MaxEntries() * (dt / 1000.0);
  }

  /**
   * Adds real time data for timepoint "now".
   *
   * @param entry
   * @returns {Promise.<TResult>|*|Request}
   */
  Push(entry) {
    const sample = Object.assign({}, entry);
    sample.sampleTimestamp = r.epochTime(entry.sampleTimestamp);
    //
    feedWatchdog();
    return r.table(table).insert(
      Object.assign({}, sample, { timestamp: r.now() })
    ).run(cnxtn);
  }

  Trim() {
    return r.table(table)
    .filter(r.row('timestamp')
    .le(r.now().sub(this.timespanSec)))
    .delete({ durability: 'soft' }).run(cnxtn);
  }
}

function CreaterethinkdbSampler(p, ltc) {
  return new RethinkdbSampler(p, ltc);
}

/**
 *  Initializes the vdaSampler module, creating a connection object
 *  and creating the table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function Init() {
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
      // return r.tableCreate(table).indexCreate('timestamp').run(cnxtn);
      return r.tableCreate(table).run(cnxtn)
      .then(() => r.table(table).indexCreate('timestamp').run(cnxtn));
    }
    return Promise.resolve();
  });
}

function GetConnection() {
  return cnxtn;
}

function GetTable() {
  return cnxtn;
}

module.exports = {
  CreaterethinkdbSampler,
  GetConnection,
  GetTable,
  Init,
};
