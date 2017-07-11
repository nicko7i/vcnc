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
const sampler = require('./vcncSampler');
const rethink = require('./rethinkSampler');
// const vdaRec = require('./src/lib/vdaReceiver');

 /**
  * This class is a custom write stream to output VDA messages to multiple files
  * to date names directories
  */
class VcncSampling {
  constructor(dt, ltc) {
    this.sampleTime = parseInt(dt, 10); // ms
    this.latency = parseInt(ltc, 10); // ms
    this.msgSampler = sampler.CreateVcncSampler(this.sampleTime, this.latency);
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
    return rethink.Init()
     .then(() => sampler.Init())
     .then(() => {
       rethink.Trim(self.TrimTimeout());
     }, (e) => {
       throw (e);
     });
  }

  PushTimeout() {
    return this.sampleTime;
  }

  TrimTimeout() {
    const period = this.sampleTime * conf.MaxEntries();
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
    if (self.msgSampler.IsSampling() === false) return;
    const bin = self.msgSampler.ReleaseBin();
    rethink.Push(bin);
  }
//    console.log('<<< Finished Send');

  ProcessCheck() {
    const self = this;
    console.info(`Total Vda messages: ${self.msgCount}`);
    console.info(`Total sampled vpm messages: ${self.msgSampler.VpmMessageCount()}`);
    console.info(`Total sampled vtrq messages: ${self.msgSampler.VtrqMessageCount()}`);
    console.info(`Total sampled messages: ${self.msgSampler.MessageCount()}`);
    console.info(`Total ignored messages = ${self.msgSampler.IgnoreMessageCount()}`);
  }
}

function CreateVcncSampling(dt, ltc) {
  return new VcncSampling(dt, ltc);
}

module.exports = {
  CreateVcncSampling,
};

