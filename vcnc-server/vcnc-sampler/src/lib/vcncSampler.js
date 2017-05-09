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
function VcncSampler(dt) {
  this.pmReadBeans = {};
  this.vtrqReadBeans = {};
  this.samplePeriod = dt;
  this.startTime = 0;
  this.empty = true;
  this.minIndex = -1;
  this.maxIndex = -1;
  this.msgCount = 0;
  this.ignoredMsgCount = 0;
}

VcncSampler.prototype.BeanIndex = function (ts) {
//  console.log('>>> Start BeanIndex');
  const self = this;
  // Add extra bean just in case to reserve it for messages out of order
  //
  if (self.empty === true) {
    self.startTime = parseInt(ts, 10) - self.samplePeriod;
  }
//  console.log('<<< Finished BeanIndex');
  return parseInt((ts - self.startTime) / self.samplePeriod, 10);
};

VcncSampler.prototype.Add = function (jsnMsg) {
//  console.log('>>> Add started');
  const self = this;
  const ts = new Date(jsnMsg.ts).getTime() / 1000;
  const index = self.BeanIndex(ts);
  if (index < self.minIndex || index - self.minIndex > conf.MaxBeans()) {
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
      self.pmReadBeans[index] = (self.pmReadBeans[index] === undefined) ?
        readBytes : self.pmReadBeans[index] + readBytes;
//      console.log(` self.pmReadBeans[index] = ${self.pmReadBeans[index]} index=${index}`);
      break;
    case 'read_vtrq':
      self.vtrqReadBeans[index] = (self.vtrqReadBeans[index] === undefined) ?
        readBytes : self.vtrqReadBeans[index] + readBytes;
//      console.log(` self.vtrqReadBeans[index] = ${self.vtrqReadBeans[index]} index=${index}`);
      break;
    default:
      self.ignoredMsgCount += 1;
      return;
  }
  //
  self.msgCount += 1;
//  console.log('<<< Add finished');
};

VcncSampler.prototype.ReleaseBean = function () {
  console.log('>>> Start ReleaseBean');
  const self = this;
  let bean;
  if (self.empty === true) return bean;
  let samplerTs = self.startTime + (self.samplePeriod * self.minIndex);

  // Set time to a center af sample interval
  samplerTs -= Math.round(self.samplePeriod / 2);
  console.log(`ReleaseBean: self.minIndex${self.minIndex} samplerTs${samplerTs}`);
  const pmRead = (self.pmReadBeans[self.minIndex] === undefined) ?
    0 : self.pmReadBeans[self.minIndex];
  const vtrqRead = (self.vtrqReadBeans[self.minIndex] === undefined) ?
    0 : self.vtrqReadBeans[self.minIndex];
  bean = {
    storageEfficiency: 0,
    rVtrq: vtrqRead,
    rVpm: pmRead,
    sampleTimestamp: samplerTs,
  };
  if (self.pmReadBeans[self.minIndex] !== undefined) delete self.pmReadBeans[self.minIndex];
  if (self.vtrqReadBeans[self.minIndex] !== undefined) delete self.vtrqReadBeans[self.minIndex];
  if (self.minIndex === self.maxIndex) {
    self.empty = true;
    self.maxIndex = -1;
    self.minIndex = -1;
  } else {
    const keys = Object.keys(self.pmReadBeans);
    self.minIndex = keys[0];
  }
  console.log(`Bean: ${json.stringify(bean)}`);
  console.log('<<< Finished ReleaseBean');
  return bean;
};

exports.CreateVcncSampler = function (dt) {
  return new VcncSampler(dt);
};
