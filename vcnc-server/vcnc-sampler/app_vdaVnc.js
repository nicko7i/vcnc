/**
 * Starts server to get DA messages using POST method of REST API
 *
 * Run file: node vda_consumer_server.js --postServer=POST,host,port --logfile=path_to_da_messages.log > path_to_console_ouput.log
 *  @param --postServer=POST,host,port - POST - using REST API method (if it's not POST exit with Error);
 *                                host - server IP;
 *                                port - listening port
 *  @param --logFile=log-file            log-file - contains all data post by DA in packed json-format; to extract messages from
 *                                packed format javascript file 'read_parse_js.js' (see description of this file)
 *
 */


// Include the necessary modules.
const http = require('http');
const fs = require('fs');
const mkdirp = require('mkdirp');
const json = require('JSON');
const Set = require('collections/set');

const jsu = require('./src/lib/JSutils');
const conf = require('./src/velstor-davcnc.conf');
const dawfs = require('./src/lib/daWriteFileStream');
const vdap = require('./src/lib/vdaParser');

const cmdl = jsu.cmd_line();

const validKeys = new Set([
  '--logDir',
  '--postVDA',
  '--sampleTime',
]);

const args = cmdl.Input(validKeys);
// TODO: get vcnc version
// jsu.DisplayVersion("Velstor Data Aggregator Consumer Server", 'da_version.json');
console.log('\nStart VCnC sampler');

const options = cmdl.JSNode('postVDA');
const logDir = cmdl.JSparam('logDir');
const parser = vdap.CreateVdaParser();

console.log(json.stringify(options));
console.log(`logDir = ${logDir}`);

// Validate input parameters
//

if (logDir === undefined || options.method === 'INVALID') {
  console.log('Invalid input parameters');
  process.exit(1);
}

if (options.method !== 'POST') {
  console.log(`Invalid REST method (should be POST): ${json.stringify(options)}`);
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
const dawStream = dawfs.DAWriteFileStream(logDir, 'post_');
// var wstream = fs.createWriteStream(logfile);

// var https = require( "https" );

const COUNT = 0;
let socketCount = 0;

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

const tsStart = Date.now();
console.log(`Time (ms):${tsStart}`);

// Process buffered messages from VDA
//
function requestHandler(request, response) {
//  console.log("--------------------------");
//  console.log(request.method + ": " + request.url);
  if (request.method == 'POST') {
    request.setEncoding('utf8');
    request.on('data', (data) => {
            // Parsing  of buffered messages on a fly
            //
      const result = [0, 1];
      const parseData = parser.parseLine(data, result);
      if (result[1] === 0) {
        console.log('Warning: Data corrupted');
      }
      dawStream._write(parseData);

// Collectiong data without parsing
//            data += "\n";
//            daw_stream._write(data);
            // console.log(COUNT++ + ". Server: POST DATA: " + data);
            // console.log(COUNT++ + ". Server: POST DATA: " + data);
    });
  }
  response.on('error', (err) => {
    console.error(err);
  });
  response.end();
  // response.end(COUNT + ". Response done: request method: " + request.method + " URI: '" + request.url + "'");
}

const server = http.createServer(requestHandler);
server.setTimeout(5000, () => {
});
server.on('connection', (socket) => {
  ++socketCount;
  console.log(`Get POST connection ${socketCount}: ${json.stringify(socket.address())}`);
  socket.on('close', () => {
    --socketCount;
    console.log(`POST socket closed: ${socketCount}`);
  });
});
server.on('connect', (request, socket, head) => {
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

// Initiate flushing of output buffer in case of no input data in a given timeout
//
const flushTimeout = conf.FlushTimeout();
setInterval(() => {
  dawStream._time_flush();
}, flushTimeout);

// Processing of Linux signals
//
process.on('SIGINT', () => {
  console.log('Caught SIGINT interrupt signal');
  dawStream._flush();
  process.exit(0);
});


// Process Linux signals
//
process.on('SIGTERM', () => {
  console.log('Caught SIGTERM interrupt signal');
  dawStream._flush();
  process.exit(0);
});

process.on('SIGUSR1', () => {
  console.log('Caught SIGUSR1 interrupt signal');
  dawStream._flush();
});

