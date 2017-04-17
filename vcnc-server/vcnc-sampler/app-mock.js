/*
 *    Copyright (C) 2015-2016    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/* eslint-disable import/no-extraneous-dependencies */
//
//  Use the vcnc-server common configuration
const config = require('../vcnc-core/src/lib/configuration');
//
//  Use the vcnc-server common rethink-db handling
const rethink = require('../vcnc-core/src/lib/rethink');
//
//  The mock sampler code lives in the core. It could also live locally in
//  ./src/lib/mockSampler.
//  const mockSampler = require('./src/lib/mockSampler');
const mockSampler = require('../vcnc-core/src/lib/mockSampler');
//
//  Initialize the modules
rethink.init()
.then(() => mockSampler.init(config.mockSampler.table))
.catch((err) => {
  console.log(err); // eslint-disable-line
  console.log('Exiting...'); // eslint-disable-line
  process.exit(1);
});
//
//  Start the mock process. Stopped by external SIGTERM
mockSampler.run(config.mockSampler.period)();
