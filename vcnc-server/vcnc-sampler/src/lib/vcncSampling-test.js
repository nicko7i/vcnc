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
const sampler = require('./vcncSampler-test');
const rethink = require('./rethinkSampler-test');
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
    this.afterSendTime = Date.now();
    this.beforeSendTime = Date.now();
    this.startTime = Date.now();
  }

  PushTimeout() {
    return this.sampleTime - (this.afterSendTime - this.beforeSendTime);
  }

  TrimTimeout() {
    const period = this.sampleTime * conf.MaxEntries();
    return period;
  }

  TrimPeriod() {
    return parseInt(this.TrimTimeout() / 1000, 10);
  }

  Process(jsnData) {
    const self = this;
    async.each(jsnData.messages, (msg) => {
//      self.msgSampler.Add(msg);
      self.msgSampler.AddTest(msg);
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

//
  SendEmptyBin() {
    const self = this;
    const dt = Date.now();
    const deltaT = self.afterSendTime - self.beforeSendTime;
    const bin = {
      storageEfficiency: (dt - self.beforeSendTime) / 1000,
      sum_st_size: 0,
      sum_extents: 0,
      rVtrq: 0,
      rVpm: deltaT,
      sampleTimestamp: (dt - self.startTime) / 1000,
    };
    rethink.PushEmptyBin(bin);
    self.beforeSendTime = dt;
    self.afterSendTime = Date.now();
  }
//
  SendTestBin() {
    const self = this;
    if (self.msgSampler.IsSampling() === false) return;
    const bin = self.msgSampler.ReleaseBinTest();
    const dt = Date.now();
    const deltaT = self.afterSendTime - self.beforeSendTime;
    bin.sampleTimestamp = (dt - self.startTime) / 1000;
    bin.storageEfficiency = (dt - self.beforeSendTime) / 1000;
//    bin.sum_extents = deltaT / 1000;
//    console.log('SendTestBin: bin = ' + json.stringify(bin));
    self.beforeSendTime = dt;
    rethink.PushTestBin(bin);
    self.afterSendTime = Date.now();
//    return callback(bin);
  }

  ProcessCheck() {
    const self = this;
    console.info(`Current time: ${Date.now()}`);
    console.info(`Current bin index: ${self.msgSampler.CurrentBin()}`);
    console.info(`Total Vda messages: ${self.msgCount}`);
    console.info(`Total sampled vpm messages: ${self.msgSampler.VpmMessageCount()}`);
    console.info(`Total sampled vtrq messages: ${self.msgSampler.VtrqMessageCount()}`);
    console.info(`Total sampled messages: ${self.msgSampler.MessageCount()}`);
    console.info(`Total ignored messages = ${self.msgSampler.IgnoreMessageCount()}`);
    console.info(`Max delivery time from Vda to Vcnc = ${self.msgSampler.MaxDaVcnc()}`);
    console.info(`Mean value of transportation time from Pmda to Vcnc = ${self.msgSampler.MeanTimePmdaVcnc()}`);
    console.info(`Std value of transportation time from Pmda to Vcnc = ${self.msgSampler.StdTimePmdaVcnc()}`);
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
function Init()
{
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

