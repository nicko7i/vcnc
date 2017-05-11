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
const fs = require('fs');
const mkdirp = require('mkdirp');
const json = require('JSON');
//
const jsu = require('./src/lib/vcncSamplerUtils');
const conf = require('./src/vcncSampler.conf');
const vs = require('./src/lib/vcncSampling');

const cmdl = jsu.cmd_line();
const validKeys = conf.vcncSamplerKeys();
const args = cmdl.Input(validKeys);

// TODO: get vcnc version
// jsu.DisplayVersion("Velstor Data Aggregator Consumer Server", 'da_version.json');
console.log('\nStart VCnC sampler');
// console.log(`Input arguments: ' + json.stringify(args));
const options = cmdl.JSNode('vda');
const logDir = cmdl.JSparam('logDir');

console.log(json.stringify(options));
console.log(`logDir = ${logDir}`);

// Validate input parameters
//

if (logDir === undefined) { // || options.method === 'INVALID') {
  console.log('Invalid input parameters');
  process.exit(1);
}

if (!options.host || !options.port) {
  console.log(`Invalid host/port: ${json.stringify(options)}`);
  process.exit(1);
}

mkdirp(logDir, (err) => {
  if (err) {
    console.log(`Directory ${logDir} could not be created: ${err}`);
    process.exit(1);
  }
});
fs.access(logDir, fs.W_OK, (err) => {
  if (err !== null) {
    console.log(`No directory or no permission to create ${logDir}`);
    console.log('Invalid input parameters');
    process.exit(1);
  }
});

const host = options.host;
const port = options.port;
console.log(`host=${host} port=${port}`);

let socketCount = 0;

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

const tsStart = Date.now();
console.log(`Time (ms):${tsStart}`);


const vcncSample = vs.CreateVcncSampling();
vcncSample.Init();

// Process buffered messages from VDA
//
function requestHandler(request, response) {
  request.setEncoding('utf8');
  request.on('data', (data) => {
//    console.log(data);
    vcncSample.Run(data);
  });
  response.on('error', (err) => {
    console.error(err);
  });
  response.end();
}

const server = http.createServer(requestHandler);
server.setTimeout(5000, () => {
});

server.on('connection', (socket) => {
  socketCount += 1;
  console.log(`Get POST connection ${socketCount}: ${json.stringify(socket.address())}`);
  socket.on('close', () => {
    socketCount -= 1;
    console.log(`POST socket closed: ${socketCount}`);
  });
});

server.on('connect', (request, socket) => {
  console.log(`POST Client requests connection: ${json.stringify(socket.address())}`);
});
server.on('clientError', (exception, socket) => {
  console.log(`POST Client error: ${json.stringify(socket.address())}`);
});

server.on('close', () => {
  console.log('POST Server Closed');
});

server.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});

// Pass data to rethinkdb
const pushTimeout = vcncSample.PushTimeout();
const trimTimeout = vcncSample.TrimTimeout();
// console.log('pushTimeout = ' + pushTimeout +  ' trimTimeout = ' + trimTimeout);

setInterval(() => {
  vcncSample.Send();
}, pushTimeout);

// Remove old data from rethinkdb table
setInterval(() => {
  vcncSample.Trim();
}, trimTimeout);


// Process Linux signals
//
// Processing of Linux signals
//
process.on('SIGINT', () => {
  console.log('Caught SIGINT interrupt signal');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Caught SIGTERM interrupt signal');
  process.exit(0);
});

process.on('SIGUSR1', () => {
  console.log('Caught SIGUSR1 interrupt signal');
});

