/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/**
 * Starts server to get DA messages using POST method of REST API
 *
 * Run file: node app.js --postServer=POST,host,port
 *                                       --logfile=<path_to_da_messages.log> -
 *                                                    path_to_console_ouput.log
 *  @param --postServer=POST,host,port - POST - using REST API method
 *                                              (if it's not POST exit with Error);
 *                                              host - server IP;
 *                                              port - listening port
 *  @param --logFile=log-file          - log-file - contains all data post by DA in json-format;
 *
 */


// Include the necessary modules.
const http = require('http');
const json = require('JSON');
const path = require('path');
//
const jsUtils = require('./src/lib/vcncSamplerUtils');
const conf = require('./src/lib/vcncSampler.conf');
const sampling = require('./src/lib/vcncSampling');
const rethink = require('./src/lib/rethinkSampler');
const storPoll = require('../vcnc-core/src/lib/pollStorageStats');
//
//  Initialize the C++ extension
//
const cnctrq = require('../js-extension/build/Release/cnctrq_client.node');

const cnctrqClient = new cnctrq.CnctrqClient();
cnctrqClient.call_me_first(path.join(__dirname, '..'));

const cmdl = jsUtils.cmd_line();
// const validKeys = conf.vcncSamplerKeys();
// const args = cmdl.Input(validKeys);

// TODO: get vcnc version

console.info('\nStart Vcnc Sampler');
// console.log(`Input arguments: ' + json.stringify(args));
const options = cmdl.JSNode('sampleServer', conf.HostPort());
// const logDir = cmdl.JSparam('logDir');
const samplePeriod = cmdl.JSparam('samplePeriod', conf.DefSamplePeriod());
const latency = cmdl.JSparam('latency', conf.DefLatency());

// console.log(`logDir = ${logDir}`);

// Validate input parameters
//

if (!options.host || !options.port) {
  console.error(`Invalid host/port: ${json.stringify(options)}`);
  process.exit(1);
}

const host = options.host;
const port = options.port;
console.log(`host=${host} port=${port}`);

const tsStart = Date.now();
console.info(`Time (ms):${tsStart}`);
console.info(`Sample period:  ${samplePeriod}`);
console.info(`Output latency:  ${latency}`);

const vcncSample = sampling.CreateVcncSampling(samplePeriod, latency);
//
//  Output messages to console in case of vcnc-sampler did not get any messages
// from vda
//

let waitFirstMessage = setInterval(
  () => {
    console.info('No messages from VDA yet at least 1 minute(s)');
  }, 60 * 1000);
// Process buffered messages from VDA
//
function requestHandler(request, response) {
  let buffer = "";	
  request.setEncoding('utf8');
  request.on('data', (data) => {
    if (waitFirstMessage !== undefined) {
      clearInterval(waitFirstMessage);
      waitFirstMessage = undefined;
    }
    buffer += data;
  });
  request.on('end', () => {
	vcncSample.Run(buffer);  
  });
  response.on('error', (err) => {
    console.error(err);
  });
  response.end();
}

// Create server
//
// let server;
const server = http.createServer(requestHandler);

// Init all components
//
sampling.Init()
.then(() => {
  server.listen(port, host, () => {
    console.info(`Listening on ${host}:${port}`);
  });
})
.catch((e) => {
  console.error(`${e}`);
  process.exit(1);
});

// Process buffered messages from VDA
//


// Pass data to rethinkdb
const send = setInterval(() => {
  vcncSample.Send();
}, vcncSample.PushTimeout());

// Remove old data from rethinkdb table
const trimPeriod = vcncSample.TrimPeriod();
const trim = setInterval(() => {
  rethink.Trim(trimPeriod);
  vcncSample.ProcessCheck();
}, vcncSample.TrimTimeout());

// Processing of Linux signals
//
function ProcessExit() {
  vcncSample.ProcessCheck();
  clearTimeout(send);
  clearTimeout(trim);
  rethink.CloseConnection();
  storPoll.shutdownStats();
  process.kill(process.pid, 'SIGKILL');
}
//
process.on('SIGTERM', () => {
  ProcessExit();
});
//
process.on('SIGINT', () => {
  ProcessExit();
});
//
process.on('SIGUSR1', () => {
  console.log('Caught SIGUSR1 interrupt signal');
  vcncSample.ProcessCheck();
});
