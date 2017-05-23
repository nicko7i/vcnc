/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
const config = require('./configuration.js');
const CnctrqClient = require('../../../js-extension/build/Release/cnctrq_client.node').CnctrqClient;

const cnctrqClient = new CnctrqClient();
const { vtrq_id } = config.peercache;
let latestValue;

/**
 *  Initializes the vtrq storage statistics poller.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function init() {
  //
  //  Before we get any data from the vtrq, initialize the value to zero, which
  //  is valid, but unlikely in real life.
  //
  latestValue = {
    value: 0,
    st_size: 0,
    extents: 0,
    timestamp: Date.now(),
  };
  //
  //  Poll the vtrq at the configured rate.
  //
  setInterval(() => {
    cnctrqClient.trq_statistic(
      vtrq_id,
      '/', // We're looking for stats over the entire vtrq..
      (result) => {
        //
        //  Don't update the interval if we get an error from the vtrq.
        //
        if (result.http_status !== 200) {
          // eslint-disable-next-line no-console
          console.log(`WARN: error ${result.http_status} from trq_statistic`);
        }
        //
        //  A vtrq will only have zero sum_extents when it is newly created. At that
        //  time, sum_st_size is also zero, so the storage efficiency is '1'.
        //
        // ... TODO Workaround to show numbers changing on the dashboard
        // ... vTRQ bug gives the same value for sum_extents and sum_st_size
        // ... By taking the log, we can see the value change while keeping it the
        // ... same magnitude as the real storage efficiency.
        const value = result.sum_extents ? result.sum_st_size / result.sum_extents : 1;
//        const value = Math.log10(1 + result.sum_st_size);
        latestValue = {
          value,
          st_size: result.sum_st_size,
          extents: result.sum_extents,
          timestamp: Date.now(),
        };
      }
    );
  },
  config.server.vtrqPollPeriod);
  return Promise.resolve();
}

/**
 *  Returns true if data is being obtained from a vtrq, false otherwise.
 *
 *  @returns {boolean}
 */
function connected() {
  return latestValue.value !== 0;
}

/**
 *  Returns a copy of the latest vtrq storage data.
 *
 *  @returns {*}
 */
function currentValue() {
  return Object.assign({}, latestValue);
}

module.exports = {
  init,
  connected,
  currentValue,
};
