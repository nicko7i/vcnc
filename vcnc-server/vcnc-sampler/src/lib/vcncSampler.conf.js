
// Include the necessary modules.

const Set = require('collections/set');
//
const config = require('../../../vcnc-core/src/lib/configuration');

// Default values of configuration parameters
const { maxEntries, maxBins, table, period, latency, hostname, port } = config.vcncSampler;

// Patthto Vcnc-sampler log-file
const logFile = '';
const smplPort = port;

// List of all tags of VDA configutation parameters
const daVcncKeywords = new Set([
  '--logDir',
  '--sampleServer',
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

const options =
  {
    host: hostname,
    port: smplPort,
  };


function Logfile() { return logFile; }
function DefSamplePeriod() { return parseInt(period, 10); }
function DefLatency() { return parseInt(latency, 10); }
function vcncSamplerKeys() { return daVcncKeywords; }
function MaxEntries() { return parseInt(maxEntries, 10); }
function Samples() { return parseInt(samples, 10); }
function MaxBins() { return parseInt(maxBins, 10); }
function Table() { return table; }
function HostPort() { return options; }

module.exports = {
  Logfile,
  DefSamplePeriod,
  DefLatency,
  vcncSamplerKeys,
  MaxEntries,
  Samples,
  MaxBins,
  Table,
  HostPort,
};
