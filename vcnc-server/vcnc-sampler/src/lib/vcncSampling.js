/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/**
 * Implement Vcnc sampling process and input sampled data to rethinkdb
 *
 */

// Setup rethinkdb
const config = require('../../../vcnc-core/src/lib/configuration.js');
const rtdb = require('rethinkdb');
//
const json = require('JSON');
const async = require('async');


let cnxtn = null;

// const { table, maxEntries, period } = config.mockSampler;
// const timespanMillisec = maxEntries * period;
// const timespanSec = timespanMillisec / 1000.0;


// const jsu = require('./JSutils');
const conf = require('../velstor-davcnc.conf');
const vdap = require('./vdaParser');
const vsm = require('./vcncSampler');
// const vdaRec = require('./src/lib/vdaReceiver');

 /**
  * This class is a custom write stream to output VDA messages to multiple files
  * to date names directories
  */
function VcncSampling(dt, ltc) {
  this.parser = vdap.CreateVdaParser();
  this.msgSampler = vsm.CreateVcncSampler(dt);
  this.sampleTime = (dt !== undefined) ? dt : conf.DefSampleTime();
  this.latency = (ltc !== undefined) ? ltc : conf.DefLatency();
  this.sendTime = this.sampleTime + this.latency;
}

/**
 *  Initializes the mockSampler module, creating a connection object
 *  and creating the table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
VcncSampling.prototype.Init = function () {
//  const self = this;
  return rtdb.connect(config.rethinkdb.connection)
  .then((conn) => {
    cnxtn = conn;  // save the connection for later reuse
  })
  .then(() =>
    //  Look for the table in the database
    rtdb.tableList().filter(v => v.eq(table)).run(cnxtn)
  )
  .then((lst) => {
    // Create the table if necessary.
    if (lst.length === 0) {
      // return r.tableCreate(table).indexCreate('timestamp').run(cnxtn);
      return rtdb.tableCreate(table).run(cnxtn)
      .then(() => rtdb.table(table).indexCreate('timestamp').run(cnxtn));
    }
    return Promise.resolve();
  });
};

VcncSampling.prototype.Run = function (data) {
  const self = this;
  try {
    const jsonData = json.parse(data);
    self.vcncSample.Run(data);
//    dawStream.write(parseData);
    async.each(jsonData.messagesa, (msg) => {
      self.msgSampler.Add(msg);
    });
    setInterval(self.Send, self.sendTime);
  } catch (err) {
    console.log('Warning: VDa data corrupted');
  }
};

VcncSampling.prototype.Send = function () {
  const self = this;
  const bean = self.msgSampler.ReleaseBean();
  console.log(json.stringify(bean));
};

exports.CreateVcncSampling = function CreateVcncSampling() {
  return new VcncSampling();
};
