const path = require('path');
const yaml = require('yamljs');
const os = require('os');

//
//  TODO: handle parse exception
//
const confPath = path.join(__dirname, '../../../config/vcnc-config.yaml');
const conf = yaml.load(confPath);
console.log('INFO:   vcnc using configuration file', confPath); // eslint-disable-line

//
//  Get our port number
//
if ('VELSTOR_VCNC_PORT' in process.env) {
  conf.server.port = process.env.VELSTOR_VCNC_PORT;
}
//
//  Get the RethinkDB host name/IP
//  Get the RethinkDB database name
//
if ('VELSTOR_VCNC_RETHINKDB_HOST' in process.env) {
  conf.rethinkdb.connection.host = process.env.VELSTOR_VCNC_RETHINKDB_HOST;
}
if ('VELSTOR_VCNC_RETHINKDB_DB' in process.env) {
  conf.rethinkdb.connection.db = process.env.VELSTOR_VCNC_RETHINKDB_DB;
}
//
//  Control whether vcnc-web is served (true/false)
//
if ('VELSTOR_VCNC_WEB_ENABLE' in process.env) {
  conf.web.enable = process.env.VELSTOR_VCNC_WEB_ENABLE;
}
//
//  Compute the default fulfillment URL.
//
if (conf.fulfill202.baseUrl === undefined) {
  const port = conf.server.port;
  conf.fulfill202.baseUrl = `http://${os.hostname()}:${port}`;
}
//
//  Get the vtrq storage efficiency polling period
//
if ('VELSTOR_VCNC_VTRQ_POLL_PERIOD_SEC' in process.env) {
  conf.vcncSampler.vtrqPollPeriod = parseInt(process.env.VELSTOR_VCNC_VTRQ_POLL_PERIOD_SEC) * 1000
}
// console.log('resolved configuration: ', conf);

module.exports = conf;
