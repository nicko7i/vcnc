const stream = require('stream');
const fs = require('fs');
const util = require('util');

const fm = require('./daFileManager');
const conf = require('../velstor-davcnc.conf');

const maxBufSsize = conf.MaxBufferSize();

/**
 * This class is a custom write stream to output VDA messages to multiple files
 * to date names directories
 */
function DA_WriteFileStream(root, pfx, sfx) {
  const self = this;
  self.wstream = null;
  self.buf_size = 0;
  self.file_size = 0;
  self.curr_file = '';            // /< Current file
  self.last_record = 0;
//    console.log('DA_WriteFileStream: prefix='+ pfx)
  self.stockBuffer = new Buffer(''); // empty
  self.fileMgr = new fm.DAFileManager(root, pfx, sfx);
  self.CreateWriteStream();
  stream.Writable.call(this, { objectMode: true, highWaterMark: maxBufSsize });
}

util.inherits(DA_WriteFileStream, stream.Writable);

DA_WriteFileStream.prototype.CreateWriteStream = function () {
  const self = this;
  self.file_size = 0;
  self.last_record = Date.now();
  self.curr_file = self.fileMgr.GetPath();
  console.log(`DA_WriteFileStream.prototype.CreateWriteStream: logFile=${self.curr_file}`);
  self.wstream = fs.createWriteStream(self.curr_file);
//    self.wstream.cork();
};

// DA_WriteFileStream.prototype.write = function(data, encoding, callback)
DA_WriteFileStream.prototype.write = function (data, encoding, cb) {
  const self = this;
  self.last_record = Date.now();
//    console.log('Ready to write');
    // Check buffer is full or expired
    //
  if (self.fileMgr.ValidStream(self.buf_size) === false) {
//        console.log('Write buffer: ' + self.stockBuffer.length);
    self.fileStat();
    self.flush();
  }

    // Check file size exceeded max size or date changed (It's time to create a new file)
    //
  if (self.fileMgr.ChangeDate() !== true) {
    console.log('Create a new date directory');
    self.flush();
    self.CreateWriteStream();
  } else if (self.file_size > 0 && self.fileMgr.ValidFile(self.file_size) !== true) {
    console.log('Create a new file');
    self.CreateWriteStream();
  }

  self.buf_size += data.length;

  const buffer = new Buffer(data);
  self.stockBuffer = Buffer.concat([self.stockBuffer, buffer]);
// console.log('Added new record: stockBuffer=' + self.stockBuffer.length + 'buf_size='
//            + self.buf_size + ' data.length=' + data.length + ' buffer.length=' + buffer.length);
//        console.log('StockBuffer=' + stockBuffer.toString())
};

// Flush stockBuffer
//
DA_WriteFileStream.prototype.flush = function (data, encoding) {
  const self = this;
  if (self.stockBuffer.length > 0) {
    self.wstream.write(self.stockBuffer);
    self.file_size += self.stockBuffer.length;
    self.stockBuffer = new Buffer('');
    self.buf_size = 0;
  }
};

// Timeout flush stockBuffer
//
DA_WriteFileStream.prototype.time_flush = function () {
  const self = this;
  const currTimeout = Date.now() - self.last_record;
  const timeout = conf.FlushTimeout();
  if (currTimeout > timeout) {
    self.flush();
    self.last_record = Date.now();
  }
};

DA_WriteFileStream.prototype.fileStat = function () {
  const self = this;
  fs.stat(self.curr_file, (err) => {
    if (err && err.code === 'ENOENT') {
      self.file_size = 0;
      console.log(`fileStat: file was removed ${self.curr_file}`);
      self.wstream = fs.createWriteStream(self.curr_file);
    }
  });
};

exports.DAWriteFileStream = function DAWriteFileStream(root, pfx) {
  return new DA_WriteFileStream(root, pfx);
};
