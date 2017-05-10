/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
// const DateTime = require('datetime-converter-nodejs');
const json = require('JSON');
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
    this.samplePeriod = (dt / 1000.0);
    this.startTime = 0;
    this.empty = true;
    this.minIndex = -1;
    this.maxIndex = -1;
    this.msgCount = 0;
    this.ignoredMsgCount = 0;
  }

  BinIndex(ts) {
    //  console.log('>>> Start BinIndex');
    const self = this;
    // Add extra bean just in case to reserve it for messages out of order
    //
    if (self.empty === true) {
      self.startTime = parseInt(ts, 10) - self.samplePeriod;
    }
    //  console.log('<<< Finished BinIndex');
    return parseInt((ts - self.startTime) / self.samplePeriod, 10);
  }

  Add(jsnMsg) {
    //  console.log('>>> Add started');
    const self = this;
    const ts = new Date(jsnMsg.ts).getTime() / 1000;
    const index = self.BinIndex(ts);
    if (index < self.minIndex || index - self.minIndex > conf.MaxBins()) {
      self.ignoredMsgCount += 1;
      return;
    }

    // First call
    //
    if (self.empty) {
      self.empty = false;
      self.minIndex = index;
    }
    if (index > self.maxIndex) {
      self.maxIndex = index;
    }
    //
    //
    const op = jsnMsg.opID;
    const readBytes = parseInt(jsnMsg.errCode, 10);
    //  console.log(`op=${op}`);
    //
    switch (op) {
      case 'read':
        self.pmReadBins[index] = (self.pmReadBins[index] === undefined) ?
          readBytes : self.pmReadBins[index] + readBytes;
        //      console.log(` self.pmReadBins[index] = ${self.pmReadBins[index]} index=${index}`);
        break;
      case 'read_vtrq':
        self.vtrqReadBins[index] = (self.vtrqReadBins[index] === undefined) ?
          readBytes : self.vtrqReadBins[index] + readBytes;
        // console.log(` self.vtrqReadBins[index] = ${self.vtrqReadBins[index]} index=${index}`);
        break;
      default:
        self.ignoredMsgCount += 1;
        return;
    }
    //
    self.msgCount += 1;
    //  console.log('<<< Add finished');
  }

  ReleaseBin() {
//    console.log('>>> Start ReleaseBin');
    const self = this;
    let bin;
    if (self.empty === true) return bin;
    let samplerTs = self.startTime + (self.samplePeriod * self.minIndex);

    // Set time to a center af sample interval
    samplerTs -= Math.round(self.samplePeriod / 2);
//    console.log(`ReleaseBin: self.minIndex${self.minIndex} samplerTs${samplerTs}`);
    const pmRead = (self.pmReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.pmReadBins[self.minIndex] / self.samplePeriod, 10);
    const vtrqRead = (self.vtrqReadBins[self.minIndex] === undefined) ?
      0 : parseInt(self.vtrqReadBins[self.minIndex] / self.samplePeriod, 10);
    bin = {
      storageEfficiency: 0,
      rVtrq: vtrqRead,
      rVpm: pmRead,
      sampleTimestamp: samplerTs,
    };
    if (self.pmReadBins[self.minIndex] !== undefined) delete self.pmReadBins[self.minIndex];
    if (self.vtrqReadBins[self.minIndex] !== undefined) delete self.vtrqReadBins[self.minIndex];
    if (self.minIndex === self.maxIndex) {
      self.empty = true;
      self.maxIndex = -1;
      self.minIndex = -1;
    } else {
      const keys = Object.keys(self.pmReadBins);
      self.minIndex = keys[0];
    }
    console.log(`Bin: ${json.stringify(bin)}`);
//    console.log('<<< Finished ReleaseBin');
    return bin;
  }
}

function CreateVcncSampler(dt) {
  return new VcncSampler(dt);
}

module.exports = {
  CreateVcncSampler,
};
