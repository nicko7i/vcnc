/**
 * VDA file parser class
 *
 */

const readline = require('readline');
const json = require('JSON');
const fs = require('fs');

// Timer initializer
//

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime();
  };
}

class VdaParser {
  constructor() {
    this.msgCount = 0;
  }
}

VdaParser.prototype.parseFile = function (lf, pf) {
  const self = this;
  self.msgCount = 0;

// Create streams
//
//    var ts_flag = - 1;
  console.log(`VdaParser.prototype.parseFile: ${lf}\n${pf}`);
  const ins = fs.createReadStream(lf);
  const outs = fs.createWriteStream(pf);
  console.log('in/out streams opened');
  const tsStart = Date.now();

// Create readline interface
//
  const rl = readline.createInterface(ins, outs);

// Parse buffered messages
//
  rl.on('line', (line) => {
    const result = [0, 1];
    const jsoStr = self.parseLine(line, result);
    if (!jsoStr.empty) {
      outs.write(jsoStr);
    }
    self.msgCount += result[0];
  });

  rl.on('close', () => {
    let ts = Date.now() - tsStart;
    outs.on('close', () => {
      ts = Date.now() - tsStart;
      console.log(`\n\n Log-file parsing had been completed. Duration: ${ts}`);
    });
  });
};

VdaParser.prototype.parseLine = function (line, res) {
  const self = this;

  let jsoArr = [];
  const jsoStr = '';

// Return value: First element is number of records in a line, second one - status of result:
//               1 - success,
//               0 - line is corrupted
    //
  try {
// Select parsing mode depending on added or not delivery time stamp to message,
// checking the 1st message
        //
    if (line.empty) {
      return jsoStr;
    }
//            console.log('line:\n' + line);
    const lastMsgIndex = line.lastIndexOf('}');
    const firstMsgIndex = line.indexOf('{');
//  console.log('lastMsgIndex=' + lastMsgIndex + ' firstMsgIndex=' + firstMsgIndex);
    if (lastMsgIndex <= 0 || firstMsgIndex !== 0) {
      console.log('Corrupted message could not be repaired: ignored');
      res[1] = 0;
      return jsoStr;
    }

        // Parse message
        //
    jsoArr = json.parse(line);
  } catch (err) {
    res[1] = 0;
    jsoArr = self.repairLine(jsoStr);
  }
  res[0] = jsoArr.messages.length;
  let jso = '';
  jsoArr.messages.forEach((elem) => {
    jso = `${jso + json.stringify(elem)}\n`;
  });
  return jso;
};

exports.CreateVdaParser = function CreateVdaParser() {
  const dap = new VdaParser();
  return dap;
};
