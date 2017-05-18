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

class RethinkdbSampler {
  constructor(dt, ltc) {
    this.period = parseInt(dt, 10);
    this.latency = parseInt(ltc, 10);
    this.timespanSec = conf.MaxEntries() * ((dt + ltc) / 1000.0);
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
