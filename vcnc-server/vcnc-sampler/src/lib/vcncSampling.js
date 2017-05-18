/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/*
 * Implementation of Vcnc sampling process and input sampled data to rethinkdb
 *
 */

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
    this.sampleTime = ((dt !== undefined) ? parseInt(dt, 10) : conf.DefSampleTime());
    this.latency = (ltc !== undefined) ? parseInt(ltc, 10) : conf.DefLatency(); // ms
    this.msgSampler = vsm.CreateVcncSampler(this.sampleTime);
    this.rdb = rs.CreaterethinkdbSampler(this.sampleTime, this.latency);
    this.msgCount = 0;
  }
   /**
    *  Initializes the vcncSampler module, creating a connection object
    *  and creating the table if necessary.
    *
    *  @return {promise} A promise fulfilled when the connection is ready.
    */
  Init() {
    const self = this;
//    console.log('>>> Start Init');
    const p = rs.Init();
    p.then(() => {
      self.msgSampler.Init();
      p.then(() => {
        self.Trim();
      });
    }, (e) => {
      console.error(`ERROR: rethinkdb is not running\n ${e}`);
      process.exit(1);
    });
//    console.log('>>> Finished Init');
  }

  PushTimeout() {
    const period = this.sampleTime + this.latency;
 //   console.log(`pushTimeout = ${period}`);
    return period;
  }

  TrimTimeout() {
    const period = (this.sampleTime + this.latency) * conf.MaxEntries();
//    console.log(`trimTimeout = ${period}`);
    return period;
  }

  Process(jsnData) {
    const self = this;
    async.each(jsnData.messages, (msg) => {
      self.msgSampler.Add(msg);
    });
  }

  Run(data) {
    const self = this;
    let jsonData;
//    console.log(`VcncSampling::Run: ${data}`);
    try {
      jsonData = json.parse(data);
      self.msgCount += jsonData.messages.length;
    } catch (err) {
      console.warn('Warning: VDa data corrupted');
      return;
    }
    if (!jsonData.messages.empty) {
      self.Process(jsonData);
    }
  }

  Send() {
    const self = this;
//    console.log('>>> Start Send');
    const bin = self.msgSampler.ReleaseBin();
//    console.log(`Send to rethinkdb: Bin: ${json.stringify(bin)}`);

    self.rdb.Push(bin);
  }
//    console.log('<<< Finished Send');

  Trim() {
    this.rdb.Trim();
  }

  ProcessCheck() {
    const self = this;
    console.info(`Total Vda messages: ${self.msgCount}`);
    console.info(`Total sampled vpm messages: ${self.msgSampler.VpmMessageCount()}`);
    console.info(`Total sampled vtrq messages: ${self.msgSampler.VtrqMessageCount()}`);
    console.info(`Total sampled messages: ${self.msgSampler.MessageCount()}`);
    console.info(`Total ignored messages = ${self.msgSampler.IgNoreMessaageCount()}`);
  }
}

function CreateVcncSampling(dt, ltc) {
  return new VcncSampling(dt, ltc);
}

module.exports = {
  CreateVcncSampling,
};

