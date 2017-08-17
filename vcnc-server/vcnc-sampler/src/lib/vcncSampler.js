/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
// const DateTime = require('datetime-converter-nodejs');
// const json = require('JSON');
//
const storPoll = require('../../../vcnc-core/src/lib/pollStorageStats');
//
const conf = require('./vcncSampler.conf');

/**
 * This class is a custom write stream to output VDA messages to multiple files
 * to date names directories
 */
class VcncSampler {
  constructor(dt, dl) {
    this.pmReadBins = {};
    this.vtrqReadBins = {};
    this.samplePeriod = parseInt(Math.round(dt / 1000.0), 10);
    this.latency = parseInt(Math.round(dl / 1000.0), 10);
    this.startDataTime = 0;
    this.samplingTime = 0;
    this.empty = true;
    this.minIndex = 0;
    this.maxIndex = 0;
    this.vpmMsgCount = 0;
    this.vtrqMsgCount = 0;
    this.ignoredMsgCount = 0;
    this.binCount = [];
    this.totalBins = 0;
  }

  BinIndex(ts) {
    const self = this;
    // Index is counting from the beginning of binning process
    //
    return parseInt((ts - self.startDataTime) / self.samplePeriod, 10);
  }

  Add(jsnMsg) {
//    console.log('>>> Add started');
    const self = this;
    const ts = parseInt(Math.round(new Date(jsnMsg.ts).getTime() / 1000), 10);
    const op = jsnMsg.opID;
    let index = 0;

// First call
//
// Set start time of data sampling
    if (self.startDataTime === 0) {
      self.samplingTime = parseInt(ts, 10) - self.latency;
      self.startDataTime = self.samplingTime - Math.round(self.samplePeriod / 2);
      self.empty = false;
      self.minIndex = 0;
      self.maxIndex = conf.MaxBins();
    }
    index = self.BinIndex(ts);
    // All bins were emptied before and new messages have come
    //
    if (self.empty) {
      if (index >= self.minIndex && index - self.minIndex < conf.MaxBins()) {
        self.empty = false;
        self.maxIndex = index;
      } else {
        self.ignoredMsgCount += 1;
        return;
      }
    }
    // Input messaage is out of time range
    //
    if (index < self.minIndex || index - self.minIndex >= conf.MaxBins()) {
      self.ignoredMsgCount += 1;
      return;
    }
    // Set max bin number
    //
    if (index > self.maxIndex) {
      self.maxIndex = index;
//      console.log(`maxIndex = ${self.maxIndex}`);
    }

    // Check new bin (debug code)
    //
    if (self.binCount[index - self.minIndex] === undefined) {
      self.binCount[index - self.minIndex] = 1;
      self.totalBins += 1;
      const currts = Date.now();
      console.log(`Current time: ${currts} index=${index} minIndex=${self.minIndex} totalBins=${self.totalBins}`);
      console.log(`Bin: ${index - self.minIndex}. ${self.binCount[index - self.minIndex]}`);
    } else {
      self.binCount[index - self.minIndex] += 1;
    }
    //

    // Add number of bytes of read operation to corresponding bin
    //
    const readBytes = parseInt(jsnMsg.errCode, 10);
    //
    switch (op) {
      case 'read':
        self.pmReadBins[index] = (self.pmReadBins[index] === undefined) ?
        readBytes : self.pmReadBins[index] + readBytes;
        self.vpmMsgCount += 1;
        break;
      case 'read_vtrq':
        self.vtrqReadBins[index] = (self.vtrqReadBins[index] === undefined) ?
        readBytes : self.vtrqReadBins[index] + readBytes;
        self.vtrqMsgCount += 1;
        break;
      default:
        console.error('Invalid operation');
        self.ignoredMsgCount += 1;
    }
  }

  GetBins(t) {
    const self = this;
    const binElems = [];
    let bin = self.ReleaseBin();
    binElems.push(bin);
    if ((t - self.samplingTime) > self.samplePeriod) {
      bin = self.ReleaseBin();
      binElems.push(bin);
    }
    return binElems;
  }

  ReleaseBin() {
    const self = this;
    // Set time to a center af sample interval
    const vpmRead = (self.pmReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.pmReadBins[self.minIndex] / self.samplePeriod, 10);
    const vtrqRead = (self.vtrqReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.vtrqReadBins[self.minIndex] / self.samplePeriod, 10);
    const se = storPoll.currentValue();
    // Set output bin
    //
    const vpmLocalRead = Math.max(vpmRead - vtrqRead, 0);
    const bin = {
      storageEfficiency: se.value,
      sum_st_size: parseInt(se.st_size, 10),
      sum_extents: parseInt(se.extents, 10),
      rVtrq: Math.log10(vtrqRead + 1),
      //  Any reads resolved on the vtrq were not resolved on the vpm. <B8569>
      rVpm: Math.log10(vpmLocalRead + 1),
      sampleTimestamp: self.samplingTime,
    };
//    console.log(`minIndex: ${self.minIndex} Bin: ${json.stringify(bin)}`);
    // Delete processed bin
    //
    if (self.pmReadBins[self.minIndex] !== undefined) delete self.pmReadBins[self.minIndex];
    if (self.vtrqReadBins[self.minIndex] !== undefined) delete self.vtrqReadBins[self.minIndex];
    if (self.minIndex === self.maxIndex) {
      self.empty = true;
    }
    self.minIndex += 1;
    self.samplingTime += self.samplePeriod;
//    console.log(`Bin: ${json.stringify(bin)}`);
//    console.log(`minIndex = ${self.minIndex} maxIndex = ${self.maxIndex}`);
//    console.log('<<< Finished ReleaseBin');
    return bin;
  }

  IsSampling() {
    return !(this.startDataTime === 0);
  }

  MessageCount() {
    return (this.vpmMsgCount + this.vtrqMsgCount);
  }

  VpmMessageCount() {
    return this.vpmMsgCount;
  }

  VtrqMessageCount() {
    return this.vtrqMsgCount;
  }

  IgnoreMessageCount() {
    return this.ignoredMsgCount;
  }
  BinCount() { return this.binCount; }
  TotalBins() { return this.totalBins; }
  CurrentBin() { return this.minIndex; }

}

function CreateVcncSampler(dt, ltc) {
  return new VcncSampler(dt, ltc);
}

function Init() {
  return storPoll.init();
}

module.exports = {
  CreateVcncSampler,
  Init,
};
