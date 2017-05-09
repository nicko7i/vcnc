/**
 * This file contains useful utilities:
 * clas responsible for input and validation key/value parameters from a command line
 * from a command line
 */

const dict = require('collections/dict');
const fs = require('fs');
const path = require('path');

//
// Global variables
//
// const ARG_COUNT = 0;
let VERSION = 0;
let BUILD = 0;
// const opt_dict = new dct.Dict();

/**
 * This class is responsible for input and validation commaqnd line arguments of Node.js
 * application to a dictionary and provide access to input parameters
 *
*/
function ProcessCommandLine() {
  this.argsDict = new dict.Dict();
}

/**
 * Collect all console input arguments in a dictionary
 *
 * @param (string set) vk  - set of valid command line options
 * @return (Dictionary)    - dictionary of key/value paramaters from a command line
 */
ProcessCommandLine.prototype.Input = function (validKeys) {
  const self = this;
  let argkey;
  let argvalue;
  let invalidKeyCount = 0;
  let ARG_COUNT = 0;

  process.argv.forEach((val, index) => {
    if (index === 1) {
      argvalue = val;
      argkey = 'app';
      self.argsDict.add(argvalue, argkey);
    }

    if (index > 1) {
      const res = val.split('=');
      argkey = res[0];
      argvalue = res.length === 1 ? '' : res[1];

      // Validate input parameters
      //
      if (validKeys.has(argkey)) {
        self.argsDict.add(argvalue, argkey);
        console.log(ARG_COUNT++ + ". " + argkey + " " + argvalue);
      } else {
        console.log(`Invalid key: ${argkey}`);
        invalidKeyCount += 1;
      }
    }
  });

  // Exit if input parameters invalid
  //
  if (invalidKeyCount > 0) {
    console.log('Input parameters are invalid');
    process.exit(1);
  }
  return self.argsDict;
};


/**
 * Input node options
 *
 * @param {string} key      - keyword of command line or configuration node option
 * @param (string) defNode  - default node settings
 * @return (JS object)      - host node (REST API method, IP address, port, usability:
 *                            (enabled, 0 disabled)
 *
 */
ProcessCommandLine.prototype.JSNode = function (key, defNode) {
  const self = this;
  const options =
    {
      host: '',
      port: 0,
    };

  const prefix = '--';
  const preKey = prefix + key;
  let value;

  if (self.argsDict.has(preKey)) {
    value = self.argsDict.get(preKey);
  } else if (defNode === undefined) {
    return options;
  } else {
    value = defNode;
  }
  const args = value.split(',');
  if (args.length === 0) {
    return options;
  }

  options.host = args[0];
  options.port = args[1];
  return options;
};


/**
 * Get JS config parameter by its name in a command line (this parameter will not be passed to C++)
 *
 * @param (string) key        - keyword of command line or configuration node option
 * @param (string) defParam  - default parameter value if defined
 * @returns {string}          - parameter value
 */
ProcessCommandLine.prototype.JSparam = function (key, defParam) {
  const self = this;
  const prefix = '--';
  const preKey = prefix + key;
  let param;
  if (self.argsDict.has(preKey)) {
    param = self.argsDict.get(preKey);
  } else {
    param = defParam;
  }
  console.log(`${key}=${param}`);
  return param;
};

/**
 * Get JS config parameter array by its name in a command line
 * (this array will not be passed to C++)
 *
 * @param (string) kname        - keyword of command line or configuration node option
 * @param (string) defArray  - default parameter value from
 * @returns {string}          - parameter value
 */
ProcessCommandLine.prototype.JSparamArray = function (kname, sep, defArray) {
  const self = this;
  const prefix = '--';
  const key = prefix + kname;
  let value;
  let arrParams = [];
  if (self.argsDict.has(key)) {
    value = self.argsDict.get(key);
  } else {
    value = defArray;
  }
  if (value.length > 0) {
    arrParams = value.split(sep);
  }
  return arrParams;
};

/**
 * Total number of input arguments in a command line
 *
 * @returns {number} - total number of input arguments
 */
ProcessCommandLine.prototype.TotalArgs = function () {
  const self = this;
  return self.argsDict.length;
};

/**
 * Total number of input arguments in a command line
 *
 * @returns {Dictionary} - total number of input arguments
 */
ProcessCommandLine.prototype.GetArgs = function () {
  const self = this;
  return self.argsDict;
};

// Create an object of DA session
//
const pcl = new ProcessCommandLine();

/**
 * Display VDA version
 * @param (string) title     - name of tool
 * @param (string) verFile  - file name containing version and build ID in json format
 * @returns {string}         - program title and its version and build ID
 */
exports.DisplayVersion = function DisplayVersion(title, verFile) {
  const vb = fs.readFileSync(verFile, 'utf8');
  const jsoVb = JSON.parse(vb);
  VERSION = jsoVb.version;
  BUILD = jsoVb.build;
  console.log(`${title}                                 Version: ${VERSION}           ` + `Build: ${BUILD}\n\n`);
};

/**
 * Get VDA session object
 * @returns {VDA session object} - VDA session object
 */
exports.cmd_line = function cmdLine() { return pcl; };


exports.DateString = function DateString(now) {
  console.log(now);
  const y = now.getFullYear();
  let m = now.getMonth() + 1;
  m = m < 10 ? `0${m}` : `${m}`;
  let d = now.getDate();
  d = d < 10 ? `0${d}` : `${d}`;
  return (y + m + d);
};

exports.DisplayTime = function DisplayTime(h, m, s) {
  const hour = h < 10 ? `0${h}` : h;
  const min = m < 10 ? `0${m}` : m;
  const sec = s < 10 ? `0${s}` : s;
  console.log(`Time: ${hour}:${min}:${sec}`);
};

exports.BeginDay = function BeginDay(now) {
  const h = now.getHours();
  const m = now.getMinutes();
  let s = now.getSeconds();
  const hour = h < 10 ? `0${h}` : h;
  const min = m < 10 ? `0${m}` : m;
  const sec = s < 10 ? `0${s}` : s;
  console.log(`Start time: ${hour}:${min}:${sec}`);
  s += Number((h * 3600) + (m * 60));
//    console.log(' s=' + s);
  return now.getTime() - (s * 1000);
};

exports.Sleep = function Sleep(milliseconds) {
  const start = Date.now();
  console.log(`sleep: ${start}`);
//    console.log('sleep: ' + startS);
  let count = 0;
  while (1) {
    if ((Date.now() - start) > milliseconds) {
      break;
    }
    count += 1;
  }
  console.log(`sleep: ${Date.now() - start}`);
  console.log(`count=${count}`);
};


exports.logArrayElement = function (element, index) { console.log(`${index}. ${element}`); };

// Get file timestamp from file name in the following format 'prefix_timestamp.log'
//
exports.GetFileTimestamp = function GetFileTimestamp(lf) {
  const sarr = lf.split('_');
  if (sarr.length < 2) {
    console.log('Invalid name; file ignored');
    return -1;
  }

  const last = sarr.length - 1;
  const wrk = sarr[last].split('.');
  if (wrk.length !== 2 || wrk[1] !== 'log') {
    console.log('Invalid name; file ignored');
    return -1;
  }

  const ts = Number(wrk[0]);
  return ts;
};

// Check file size
//
exports.GetFileSize = function GetFileSize(lf) {
  const stats = fs.statSync(lf);
  const fileSize = stats.size;
  return fileSize;
};
exports.GetDirectories = function (p) {
  return fs.readdirSync(p).filter(file => fs.statSync(path.join(p, file)).isDirectory());
};

exports.ReadFileAndDelete = function ReadFileAndDelete(p, defInput, callback) {
  let dt;
  fs.access(p, fs.F_OK, (err) => {
    if (err) {
      return callback(defInput);
    }
    fs.readFile(p, 'utf8', (err, dt) => {
      if (err) return callback(defInput);
    });
    return callback(dt.toString());
  });
};

exports.DisableSubscription = function DisableSubscription(subs) {
  for (let i = 0; i < subs.length; i += 1) {
    subs[i] = 0;
  }
};

