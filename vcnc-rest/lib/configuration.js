const path = require('path');
const yaml = require('yamljs');
const os = require('os');

//
//  TODO: handle parse exception
//
const confPath = path.join(__dirname, '../config/vcnc-config.yaml');
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
//  Compute the default fulfillment URL.
//
if (conf.fulfill202.baseUrl === undefined) {
  const port = conf.server.port;
  conf.fulfill202.baseUrl = `http://${os.hostname()}:${port}`;
}
// console.log('resolved configuration: ', conf);

module.exports = conf;
