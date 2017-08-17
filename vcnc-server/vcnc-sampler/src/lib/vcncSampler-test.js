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
    this.indexCount = [];
    this.binCount = [];
    this.totalBins = 0;
    this.avgTimeVcncDA = 0;
    this.stdTimeVcncDA = 0;
    this.maxTimeVcncDA = 0;
    this.rowNumber = 0;
  }

  BinIndex(ts) {
    //  console.log('>>> Start BinIndex');
    const self = this;
    //  console.log('<<< Finished BinIndex');
    // Index is counting from the beginning of binning process
    return parseInt((ts - self.startDataTime) / self.samplePeriod, 10);
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

  AddTest(jsnMsg) {
//    console.log('>>> Add started');
    const self = this;
    const msgts = new Date(jsnMsg.ts).getTime();
    const ts = parseInt(Math.round(msgts / 1000), 10);
    const currts = Date.now();
    const op = jsnMsg.opID;
    // noinspection JSAnnotator
    let index = 0;

    // First call
    //
    // Set start time of data sampling
    //
    if (self.startDataTime === 0) {
      self.samplingTime = parseInt(ts, 10) - self.latency;
      self.startDataTime = self.samplingTime - Math.round(self.samplePeriod / 2);
      self.empty = false;
      self.minIndex = 0;
      self.maxIndex = conf.MaxBins();
      index = self.BinIndex(ts);
      console.log(`startDataTime=${self.startDataTime} samplingTime=${self.samplingTime
        } latency= ${self.latency} samplePeriod=${self.samplePeriod} index=${index}`);
      console.log(`ts=${ts} msgts=${msgts}`);
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
    // Add number of bytes of read operation to corresponding bin
    //
    if (self.binCount[index - self.minIndex] === undefined) {
      self.binCount[index - self.minIndex] = 1;
      self.totalBins += 1;
      console.info(`Current time: ${currts} index=${index} minIndex=${self.minIndex} totalBins=${self.totalBins}`);
      console.info(`Bin: ${index - self.minIndex}. ${self.binCount[index - self.minIndex]}`);
    } else {
      self.binCount[index - self.minIndex] += 1;
    }
    self.indexCount[index] = (self.indexCount[index] === undefined) ?
      1 : self.indexCount[index] + 1;

    const readBytes = currts - msgts;

    self.pmReadBins[index] = (self.pmReadBins[index] === undefined) ?
    readBytes : self.pmReadBins[index] + readBytes;

    switch (op) {
      case 'read':
        self.vpmMsgCount += 1;

        break;
      case 'read_vtrq':
        self.vtrqMsgCount += 1;
        break;
      default:
        console.error('Invalid operation');
        self.ignoredMsgCount += 1;
        return;
    }
    //
    const addTs = Date.now() - currts;
    self.vtrqReadBins[index] = (self.vtrqReadBins[index] === undefined) ?
      addTs : self.vtrqReadBins[index] + addTs;
    const rbs = readBytes / 1000;
    self.avgTimeVcncDA += rbs;
    self.stdTimeVcncDA += rbs * rbs;
    if (readBytes > self.maxTimeVcncDA) self.maxTimeVcncDA = readBytes;
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

  ReleaseBinTest() {
    const self = this;
//    const currts = Date.now();
    // Set time to a center af sample interval
    let vpmRead = 0;
    if (self.pmReadBins[self.minIndex] !== undefined) {
      vpmRead = self.pmReadBins[self.minIndex] / self.indexCount[self.minIndex];
    }
//    const vtrqRead = (self.vtrqReadBins[self.minIndex] === undefined) ?
//      0 : self.vtrqReadBins[self.minIndex] / self.indexCount[self.minIndex];

    let se = storPoll.currentValue();
    if (se.value === undefined) {
      se = {
        value: 1,
        st_size: 0,
        extents: 0,
      };
    }
    const binCount = self.indexCount[self.minIndex] === undefined ?
      0 : self.indexCount[self.minIndex];
    // Set output bin
    //
    const bin = {
      storageEfficiency: se.value,
      sum_st_size: binCount, // parseInt(se.st_size, 10),
      sum_extents: self.minIndex, // parseInt(se.extents, 10),
      rVtrq: self.minIndex * self.samplePeriod, // vtrqRead / 1000,
      //  Any reads resolved on the vtrq were not resolved on the vpm. <B8569>
      rVpm: vpmRead / 1000,
      sampleTimestamp: self.samplingTime,
    };

//    console.log(`minIndex: ${self.minIndex} Bin: ${json.stringify(bin)}`);
    // Delete processed bin
    //
    if (self.pmReadBins[self.minIndex] !== undefined) {
      delete self.pmReadBins[self.minIndex];
      delete self.indexCount[self.minIndex];
    }
    if (self.vtrqReadBins[self.minIndex] !== undefined) delete self.vtrqReadBins[self.minIndex];
    if (self.minIndex === self.maxIndex) {
      self.empty = true;
    }
    self.minIndex += 1;
    self.samplingTime += self.samplePeriod;
//    console.log(`Bin: ${json.stringify(bin)}`);
//    console.log(`minIndex = ${self.minIndex} maxIndex = ${self.maxIndex}`);
//    console.log('<<< Finished ReleaseBin');
//    const rts = (Date.now() - currts) / 1000;
    return bin;
  }

  BinCount() { return this.binCount; }
  TotalBins() { return this.totalBins; }
  CurrentBin() { return this.minIndex; }
  MeanTimePmdaVcnc() {
    const self = this;
    const count = self.vpmMsgCount + self.vtrqMsgCount;
    return ((count === 0) ? 0 : (self.avgTimeVcncDA / count));
  }
  StdTimePmdaVcnc() {
    const self = this;
    const mv = self.MeanTimePmdaVcnc();
    const count = self.vpmMsgCount + self.vtrqMsgCount;
    const stdValue = count < 2 ? 0 :
      Math.sqrt((self.stdTimeVcncDA - mv * mv * count) / (count - 1));
    return stdValue;
  }
  MaxDaVcnc() { return this.maxTimeVcncDA / 1000; }
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
