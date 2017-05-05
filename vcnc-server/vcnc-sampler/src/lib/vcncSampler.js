/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
// const DateTime = require('datetime-converter-nodejs');

const conf = require('../velstor-davcnc.conf');

// const sm = require('./src/lib/vcncSampler');
// const vdaRec = require('./src/lib/vdaReceiver');


/**
 * This class is a custom write stream to output VDA messages to multiple files
 * to date names directories
 */
function VcncSampler(dt) {
  this.pmReadBeans = {};
  this.vtrqReadBeans = {};
  this.samplePeriod = dt;
  this.startTime = new Date().getTime() / 1000;  // seconds
  this.empty = 0;
  this.minIndex = -1;
  this.maxIndex = -1;
  this.msgCount = 0;
  this.ignoredMsgCount = 0;
}

VcncSampler.prototype.BeanIndex = function (ts) {
  const self = this;
  return (ts - self.startTime) / self.samplePeriod;
};

VcncSampler.prototype.Add = function (jsnMsg) {
  const self = this;
  const ts = new Date(jsnMsg.ts).getTime() / 1000;
  const index = self.BeanIndex(ts);
  if (index < 0) {
    self.ignoredMsgCount += 1;
    return;
  }

  const op = jsnMsg.opID;
  const readBytes = jsnMsg.errCode;
  let workBean;
  switch (op) {
    case 'read':
      workBean = self.pmReadBeans;
      break;
    case 'read_vtrq':
      workBean = self.vtrqReadBeans;
      break;
    default:
      self.ignoredMsgCount += 1;
      return;
  }

  // First call
  //
  if (self.empty) {
    self.empty = false;
    self.startTime = ts;
    self.minIndex = index;
  }
  if (index > self.maxIndex) {
    if (index - self.fistIndex > conf.MaxBeans()) {
      self.ignoredMsgCount += 1;
      return;
    }
    self.maxIndex = index;
  }
  workBean[index] = (workBean[index] === undefined) ? readBytes : workBean[index] + readBytes;
  self.msgCount += 1;
};

VcncSampler.prototype.ReleaseBean = function () {
  const self = this;
  let bean;
  if (self.empty !== true) return bean;
  let samplerTs = self.startTime + (self.samplePeriod * self.minIndex);

  // Set time to a center af sample interval
  samplerTs -= Math.round(self.samplePeriod / 2);
  bean = {
    storageEfficiency: 0,
    rVtrq: self.vtrqReadBeans[self.minIndex],
    rVpm: self.pmReadBeans[self.minIndex],
    sampleTimestamp: samplerTs,
  };
  delete self.pmReadBeans[self.minIndex];
  delete self.vtrqReadBeans[self.minIndex];
  if (self.minIndex === self.maxIndex) {
    self.empty = true;
    self.maxIndex = -1;
  } else {
    const keys = Object.keys(self.pmReadBeans);
    self.minIndex = keys[0];
  }
  return bean;
};

exports.CreateVcncSampler = function (dt) {
  return new VcncSampler(dt);
};
