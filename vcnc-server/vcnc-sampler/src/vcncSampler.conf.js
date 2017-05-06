
// Include the necessary modules.

const Set = require('collections/set');

// Default values of configuration parameters

const sampleTime = 2000;  // ms
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


// exports.verbose = function  verbose() {return verbose_level;}
function Logfile() { return logFile; }
function DefSampleTime() { return sampleTime; }
function DefLatency() {return latency;}
function vcncSamplerKeys() { return daVcncKeywords; }
function MaxSize() { return maxSize; }
function Samples() { return samples; }
function MaxBeans() { return maxBeans; }


module.exports = {
  Logfile,
  DefSampleTime,
  DefLatency,
  vcncSamplerKeys,
  MaxSize,
  Samples,
  MaxBeans,
};
