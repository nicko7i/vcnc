/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/**
 * Implement Vcnc sampling process and input sampled data to rethinkdb
 *
 */

//
const json = require('JSON');
const async = require('async');
//
const conf = require('../vcncSampler.conf');
const vsm = require('./vcncSampler');
const rs = require('./rethinkSampler');
// const vdaRec = require('./src/lib/vdaReceiver');

 /**
  * This class is a custom write stream to output VDA messages to multiple files
  * to date names directories
  */
class VcncSampling {
  constructor(dt, ltc) {
    this.sampleTime = ((dt !== undefined) ? dt : conf.DefSampleTime());
    this.latency = (ltc !== undefined) ? ltc : conf.DefLatency(); // ms
    this.msgSampler = vsm.CreateVcncSampler(this.sampleTime);
    this.rdb = rs.CreaterethinkdbSampler(this.sampleTime, this.latency);
  }

  BinTimeout() {
    return (this.sampleTime + this.latency);
  }

  Run(data) {
    const self = this;
    let jsonData;
    //    console.log(`VcncSampling::Run: ${data}`);
    try {
      jsonData = json.parse(data);
    } catch (err) {
      console.log('Warning: VDa data corrupted');
    }
    async.each(jsonData.messages, (msg) => {
      self.msgSampler.Add(msg);
    });
  }

  Send() {
    const self = this;
//    console.log('>>> Start Send');
    const bin = self.msgSampler.ReleaseBin();
    if (bin !== undefined) {
      console.log(`Bin: ${json.stringify(bin)}`);
      self.rdb.Push(bin);
    }
//    console.log('<<< Finished Send');
  }

  Trim() {
    this.rdb.Trim();
  }
}

function CreateVcncSampling(dt, ltc) {
  return new VcncSampling(dt, ltc);
}


/**
 *  Initializes the vdaSampler module, creating a connection object
 *  and creating the table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function Init() {
  rs.Init();
}


module.exports = {
  CreateVcncSampling,
  Init,
};

