
// Include the necessary modules.

const Set = require('collections/set');
//
const config = require('../../vcnc-core/src/lib/configuration.js');

// Default values of configuration parameters
const { maxEntries, maxBins, table, period, latency } = config.vdaSampler;

// Patthto Vcnc-sampler log-file
const logFile = '';

// List of all tags of VDA configutation parameters
const daVcncKeywords = new Set([
  '--logDir',
  '--vda',
  '--samplePeriod',
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


function Logfile() { return logFile; }
function DefSamplePeriod() { return period; }
function DefLatency() { return latency; }
function vcncSamplerKeys() { return daVcncKeywords; }
function MaxEntries() { return maxEntries; }
function Samples() { return samples; }
function MaxBins() { return maxBins; }
function Table() { return table; }

module.exports = {
  Logfile,
  DefSamplePeriod,
  DefLatency,
  vcncSamplerKeys,
  MaxEntries,
  Samples,
  MaxBins,
  Table,
};
