
// Include the necessary modules.

const Set = require('collections/set');

// Default values of configuration parameters

const sampleTime = 5000;  // ms
const waitTimeSend = 5000;  // ms

// Level of output to log-file:
// 3 - error messages only;
// 4 - + warning messages
// 6 - + info messages;
// 7 - + debug messages
// const verboseLevel = 6;

// Patthto Vcnc-sampler log-file
const logFile = '';

// List of all tags of VDA configutation parameters
const daVcncKeywords = new Set([
  '--logDir',
  '--postVDA',
  '--sampleTime',
]);

// Consumer server/client default parameters
//

// timeout of forced client/server  message buffer output
const BUFFER_TIMEOUT = 5000; // ms (5 s)

// Maximal size of input message buffer
const MAX_BUFFER_SIZE = 5000000; // ~5M   (10M is fine too)

// Maximal output file size (If message output file exceed this size a new file will be created)
const MAX_FILE_SIZE = 100000000;  // ~100Mb

// Maximal time of output in a current file (after that a new file will be created for output)
const FILE_TIMEOUT = 3600000; // 30 min in ms

// Flush buffer timeout
const FLUSH_TIMEOUT = 30000; // 30 s

// exports.verbose = function  verbose() {return verbose_level;}
exports.logfile = function logfile() { return logFile; };
exports.BufferTimeout = function BufferTimeout() { return BUFFER_TIMEOUT; };
exports.MaxBufferSize = function MaxBufferSize() { return MAX_BUFFER_SIZE; };
exports.MaxFileSize = function MaxFileSize() { return MAX_FILE_SIZE; };
exports.FileTimeDelay = function FileTimeDelay() { return FILE_TIMEOUT; };
exports.FlushTimeout = function FlushTimeout() { return FLUSH_TIMEOUT; };
exports.SampleTime = function SampleTime() { return sampleTime; };
exports.defWaitSend = function defWaitSend() {return waitTimeSend;};

/*
exports.def_verbose= function  def_verbose() {
    var vs = {"verbose": verbose};
    return vs;
}
*/
exports.defLogfile = function defLlogfile() {
  const log = { def_logfile: logFile };
  return log;
};
exports.vcncSamplerKeys = function vcncSamplerKeys() { return daVcncKeywords; };

