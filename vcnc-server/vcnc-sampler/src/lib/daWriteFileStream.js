'use strict';

var stream = require('stream');
var fs = require('fs');
var path = require('path');
var util = require('util');

var jsu = require('./JSutils');
var fm = require('./daFileManager');
var conf = require('../velstor-davcnc.conf');

var max_buf_size = conf.MaxBufferSize();

/**
 * This class is a custom write stream to output VDA messages to multiple files
 * to date names directories
 */
function DA_WriteFileStream(root, pfx, sfx)
{
    var self = this;
    self._wstream = null;
    self._buf_size = 0;
    self._file_size = 0;
    self._curr_file = "";            ///< Current file
    self._last_record = 0;
//    console.log('DA_WriteFileStream: prefix='+ pfx)
    self._stockBuffer = new Buffer(''); // empty
    self._fileMgr = new fm.DAFileManager(root, pfx, sfx);
    self.CreateWriteStream();
    stream.Writable.call(this, {objectMode: true, highWaterMark: max_buf_size});
}

util.inherits(DA_WriteFileStream, stream.Writable);

DA_WriteFileStream.prototype.CreateWriteStream = function()
{
    var self = this;
    self._file_size = 0;
    self._last_record = Date.now();
    self._curr_file = self._fileMgr.GetPath();
    console.log('DA_WriteFileStream.prototype.CreateWriteStream: logFile=' + self._curr_file);
    self._wstream = fs.createWriteStream(self._curr_file);
//    self._wstream.cork();
}

// DA_WriteFileStream.prototype._write = function(data, encoding, callback)
DA_WriteFileStream.prototype._write = function(data, encoding, cb)
{
    var self = this;
    self._last_record = Date.now();
//    console.log('Ready to write');
    // Check buffer is full or expired
    //
    if (self._fileMgr.ValidStream(self._buf_size) === false) {
//        console.log('Write buffer: ' + self._stockBuffer.length);
        self._fileStat();
        self.flush();
    }

    // Check file size exceeded max size or date changed (It's time to create a new file)
    //
    if (self._fileMgr.ChangeDate() !== true) {
        console.log('Create a new date directory');
        self._flush();
        self.CreateWriteStream();
    } else if (self._file_size > 0 && true !== self._fileMgr.ValidFile(self._file_size)) {
        console.log('Create a new file');
        self.CreateWriteStream();
    }

    self._buf_size += data.length;

    var buffer = new Buffer(data);
    self._stockBuffer = Buffer.concat([self._stockBuffer, buffer]);
//        console.log('Added new record: _stockBuffer=' + self._stockBuffer.length + ' buf_size=' + self._buf_size
//                     + ' data.length=' + data.length + ' buffer.length=' + buffer.length);
//        console.log('StockBuffer=' + stockBuffer.toString())

}

// Flush stockBuffer
//
DA_WriteFileStream.prototype.flush = function(data, encoding, cb)
{
    var self = this;
    if (self._stockBuffer.length > 0) {
        self._wstream.write(self._stockBuffer);
        self._file_size += self._stockBuffer.length;
        self._stockBuffer = new Buffer('');
        self._buf_size = 0;
    }
}

// Timeout flush stockBuffer
//
DA_WriteFileStream.prototype.time_flush = function()
{
    var self = this;
    var curr_timeout = Date.now() - self._last_record;
    var timeout = conf.FlushTimeout();
    if (curr_timeout > timeout) {
        self.flush();
        self._last_record = Date.now();
    }
}

DA_WriteFileStream.prototype._fileStat = function()
{
    var self = this;
    fs.stat(self._curr_file, function(err, stat) {
        if (err && 'ENOENT' === err.code) {
            self._file_size = 0;
            console.log('fileStat: file was removed ' + self._curr_file);
            self._wstream = fs.createWriteStream(self._curr_file);
        }
    });
}

exports.DAWriteFileStream = function DAWriteFileStream(root, pfx) {return new DA_WriteFileStream(root, pfx);}
