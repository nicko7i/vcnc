
// Include the necessary modules.

const Set = require('collections/set');
//
const config = require('../../vcnc-core/src/lib/configuration.js');

// Default values of configuration parameters
const { maxEntries, maxBeans, table, period, latency } = config.vdaSampler;

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

// exports.verbose = function  verbose() {return verbose_level;}
function Logfile() { return logFile; }
function DefSampleTime() { return period; }
function DefLatency() {return latency;}
function vcncSamplerKeys() { return daVcncKeywords; }
function MaxEntries() { return maxEntries; }
function Samples() { return samples; }
function MaxBeans() { return maxBeans; }
function Table() {return table;}

module.exports = {
  Logfile,
  DefSampleTime,
  DefLatency,
  vcncSamplerKeys,
  MaxEntries,
  Samples,
  MaxBeans,
  Table,
};
