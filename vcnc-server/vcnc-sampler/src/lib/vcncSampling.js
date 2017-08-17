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
const conf = require('./vcncSampler.conf');
const sampler = require('./vcncSampler');
const rethink = require('./rethinkSampler');
// const vdaRec = require('./src/lib/vdaReceiver');

 /**
  * This class is a custom write stream to output VDA messages to multiple files
  * to date names directories
  */
class VcncSampling {
  constructor(dt, ltc) {
    this.samplePeriod = parseInt(dt, 10); // ms
    this.latency = parseInt(ltc, 10); // ms
    this.msgSampler = sampler.CreateVcncSampler(this.samplePeriod, this.latency);
    this.msgCount = 0;
  }

  PushTimeout() {
    return this.samplePeriod;
  }

  TrimTimeout() {
    const period = this.samplePeriod * conf.MaxEntries();
    return period;
  }

  TrimPeriod() {
    return parseInt(this.TrimTimeout() / 1000, 10);
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
    const sendTime = parseInt((Date.now() / 1000), 10);
    const bin = self.msgSampler.GetBins(sendTime);
    bin.forEach((e) => {
      rethink.Push(e);
    });
  }
//
//    console.log('<<< Finished Send');

  ProcessCheck() {
    const self = this;
    console.info(`Current time: ${Date.now()}`);
    console.info(`Total Vda messages: ${self.msgCount}`);
    console.info(`Total sampled vpm messages: ${self.msgSampler.VpmMessageCount()}`);
    console.info(`Total sampled vtrq messages: ${self.msgSampler.VtrqMessageCount()}`);
    console.info(`Total sampled messages: ${self.msgSampler.MessageCount()}`);
    console.info(`Total ignored messages = ${self.msgSampler.IgnoreMessageCount()}`);
    const binCount = self.msgSampler.BinCount();
    const totalBins = self.msgSampler.TotalBins();
    console.log('Bins:');
    for (let i = 0; i < totalBins; i += 1) {
      if (binCount[i] !== undefined) {
        console.log(`${i}. ${binCount[i]}`);
      }
    }
  }
}

/**
 *  Creating a connection to rethinkdb
 *  and creating the database/table if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function Init() {
  return rethink.Init()
    .then(() => sampler.Init())
    .then(() => {
      rethink.Trim(0);
      return Promise.resolve();
    }, (e) => {
      throw (e);
    });
}


function CreateVcncSampling(dt, ltc) {
  return new VcncSampling(dt, ltc);
}

module.exports = {
  CreateVcncSampling,
  Init,
};

