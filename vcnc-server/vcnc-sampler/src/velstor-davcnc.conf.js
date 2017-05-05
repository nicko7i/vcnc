
// Include the necessary modules.

const Set = require('collections/set');

// Default values of configuration parameters

const sampleTime = 5000;  // ms
const waitTimeSend = 5000;  // ms
const maxSize = 100;
const latency = 500; // ms

// Patthto Vcnc-sampler log-file
const logFile = '';

// List of all tags of VDA configutation parameters
const daVcncKeywords = new Set([
  '--logDir',
  '--vda',
  '--sampleTime',
  '--latency',
]);

// Consumer server/client default parameters
//

// Vda messages used for sampling
const samples =
  {
    read: 1,
    read_vtrq: 1,
  };

// Maximal number of buckets
const maxBeans = 100; // ~5M   (10M is fine too)


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
function Logfile() { return logFile; }
function BufferTimeout() { return BUFFER_TIMEOUT; }
function MaxBufferSize() { return MAX_BUFFER_SIZE; }
function MaxFileSize() { return MAX_FILE_SIZE; }
function FileTimeDelay() { return FILE_TIMEOUT; }
function FlushTimeout() { return FLUSH_TIMEOUT; }
function DefSampleTime() { return sampleTime; }
function DefLatency() {return latency;}
function DefWaitSend() { return waitTimeSend; }
function DefLogfile() { return { def_logfile: logFile }; }
function vcncSamplerKeys() { return daVcncKeywords; }
function MaxSize() { return maxSize; }
function Samples() { return samples; }
function MaxBeans() { return maxBeans; }


module.exports = {
  Logfile,
  BufferTimeout,
  MaxBufferSize,
  MaxFileSize,
  FileTimeDelay,
  FlushTimeout,
  DefSampleTime,
  DefLatency,
  DefWaitSend,
  DefLogfile,
  vcncSamplerKeys,
  MaxSize,
  Samples,
  MaxBeans,
};
