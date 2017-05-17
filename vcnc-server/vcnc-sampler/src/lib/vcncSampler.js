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
const conf = require('../vcncSampler.conf');

/**
 * This class is a custom write stream to output VDA messages to multiple files
 * to date names directories
 */
class VcncSampler {
  constructor(dt) {
    this.pmReadBins = {};
    this.vtrqReadBins = {};
    this.samplePeriod = (parseInt(dt, 10) / 1000.0);
    this.startTime = 0;
    this.empty = true;
    this.minIndex = 0;
    this.maxIndex = 0;
    this.vpmMsgCount = 0;
    this.vtrqMsgCount = 0;
    this.ignoredMsgCount = 0;
  }

  Init() {
    storPoll.init();
//    console.log('StorageEfficiency: ' + storPoll.currentValue().value);
    return Promise.resolve();
  }

  BinIndex(ts) {
    //  console.log('>>> Start BinIndex');
    const self = this;
     //  console.log('<<< Finished BinIndex');
    return parseInt((ts - self.startTime) / self.samplePeriod, 10);
  }

  Add(jsnMsg) {
//    console.log('>>> Add started');
    const self = this;
    const ts = new Date(jsnMsg.ts).getTime() / 1000;
    let index = self.BinIndex(ts);

    // First call
    //
    // Set start time of data sampling
    //
    if (self.startTime === 0) {
      self.startTime = parseInt(ts, 10);
      self.empty = false;
      self.minIndex = 0;
      self.maxIndex = 0;
      index = 0;
    } else {
      index = self.BinIndex(ts);
    }

    // All bins were emptied before and new messages have come
    //
    if (self.empty) {
      if (index > self.minIndex) {
        self.empty = false;
        self.minIndex = index;
//        console.log(`ts = ${ts} index = ${index} minIndex = ${self.minIndex}`);
      } else {
        self.ignoredMsgCount += 1;
        return;
      }
    }
    // Input messaage is out of time range
    //
    if (index < self.minIndex || index - self.minIndex > conf.MaxBins()) {
      self.ignoredMsgCount += 1;
      return;
    }
    // Set max bin number
    //
    if (index > self.maxIndex) {
      self.maxIndex = index;
//      console.log(`maxIndex = ${self.maxIndex}`);
    }
    // Add number of bytes of read operation to corresponding bin
    //
    const op = jsnMsg.opID;
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
        return;
    }
    //
    self.msgCount += 1;
//    console.log('<<< Add finished');
  }

  ReleaseBin() {
    const self = this;
//    console.log('>>> Start ReleaseBin ');
//    console.log(`startTime = ${self.startTime} minIndex = ${self.minIndex}`);
    let samplerTs = (self.startTime === 0) ? parseInt(Date.now() / 1000, 10) : self.startTime +
      (self.samplePeriod * self.minIndex);

    // Set time to a center af sample interval
    samplerTs -= Math.round(self.samplePeriod / 2);
    const pmRead = (self.pmReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.pmReadBins[self.minIndex] / self.samplePeriod, 10);
    const vtrqRead = (self.vtrqReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.vtrqReadBins[self.minIndex] / self.samplePeriod, 10);
    const se = storPoll.currentValue().value;

    // Set output bin
    //
    const bin = {
      storageEfficiency: se,
      rVtrq: vtrqRead,
      rVpm: pmRead,
      sampleTimestamp: samplerTs,
    };
//    console.info(`Processed messages: ${self.MessageCount()} Ignored messages: ${self.IgNoreMessaageCount()}`);
    // Delete processed bin
    //
//    let keys1 = Object.keys(self.pmReadBins);
//    for (let i = 0; i < keys1.length; i++) {
//      console.log(`Key[${i}] = ${keys1[i]}`);
//    }

    if (self.pmReadBins[self.minIndex] !== undefined) delete self.pmReadBins[self.minIndex];
    if (self.vtrqReadBins[self.minIndex] !== undefined) delete self.vtrqReadBins[self.minIndex];
//    console.log(`ReleaseBin 1: minIndex= ${self.minIndex} maxIndex = ${self.maxIndex}`);
    if (parseInt(self.minIndex, 10) === parseInt(self.maxIndex, 10)) {
      self.empty = true;
      self.maxIndex = 0;
      self.minIndex = 0;
    } else if (self.maxIndex > 0) {
      const keys = Object.keys(self.pmReadBins);
      self.minIndex = keys[0];
    }
//    console.log(`Bin: ${json.stringify(bin)}`);
//    console.log(`minIndex = ${self.minIndex} maxIndex = ${self.maxIndex}`);
//    console.log('<<< Finished ReleaseBin');
    return bin;
  }

  MessageCount() { return (this.vpmMsgCount + this.vtrqMsgCount); }
  VpmMessageCount() { return this.vpmMsgCount; }
  VtrqMessageCount() { return this.vtrqMsgCount; }
  IgNoreMessaageCount() { return this.ignoredMsgCount; }
}

function CreateVcncSampler(dt) {
  return new VcncSampler(dt);
}

module.exports = {
  CreateVcncSampler,
};
