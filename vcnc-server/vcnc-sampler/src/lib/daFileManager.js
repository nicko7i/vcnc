/**
 * This file contains FileManager class responsible for generation file paths
 * for message collection
 *
 */

'use strict'

var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var fs = require('fs');

var jsu = require('./JSutils');
var conf = require('../velstor-davcnc.conf');

var max_buf_size = conf.MaxBufferSize();
var buf_delay = conf.BufferTimeout();
var max_file_size = conf.MaxFileSize();
var file_delay = conf.FileTimeDelay();

var DAY_SECS = 86400000; // ms

/**
 * This class implements file management to output VDA messages to multiple files
 * to date names directories
 */
function DA_FileManager (root, pfx, sfx)
{
    var self = this;
    self._rootDir = root;      ///< path to a directory containig VDA results
    self._prefix = (pfx === undefined) ? "" : pfx;   ///< file name prefix ('post_ or get_)
    self._suffix = (sfx === undefined) ? "" : sfx;   ///< file name suffix if any suffix exists
    self._beginDay;            ///< timestamp off 00:00:00 of current day in ms
    self._currDir;             ///< current date directory
    self._last_ts = 0;         ///< timestamp (ms) of file creation relative to begin of the day
    self._count = 0;            ///< index of output file for a particular day
    self._buffer_time = 0;     ///< time when last buffer was written to file
    self.Init();
}

DA_FileManager.prototype.Init = function ()
{
    var self = this;
    console.log("Init starts");
    var timer = new Date();
    var date = jsu.DateString(timer);
    self._beginDay = jsu.BeginDay(timer);
    self._currDir = self._rootDir + '/' + date;
    console.log('_currDir=' + self._currDir);

    mkdirp(self._currDir, function (err) {
        mkdirp(self._currDir, function (err) {
            if (err) {
                console.log("Directory " + self._currDir + " could not be created: " + err);
                process.exit(1);
            }
        });
    });
}

DA_FileManager.prototype.Reset = function ()
{
    var self = this;
    var timer = new Date();
    var date = jsu.DateString(timer);
    self._beginDay = jsu.BeginDay(timer);
    self._currDir = self._rootDir + '/' + date;
    console.log('currDir=' + self._currDir);
    mkdirp(self._currDir, function (err) {
        if (err) {
            console.log("Directory " + self._currDir + " could not be created: " + err);
            process.exit(1);
        }
    });
}

DA_FileManager.prototype.GetPath = function ()
{
    var self = this;
    var ts = Date.now();
    var dt = ts - self._beginDay;
    console.log('dt=' + dt);
    if (dt >= DAY_SECS) {
        self.Reset();
        dt = ts - self._beginDay;
    }

    if (dt === self._last_ts) {
        dt += 1;
    }
    self._last_ts = dt;
    self._buffer_time = self._last_ts;
    self._currFile = self._currDir + "/" + self._prefix + dt + self._suffix + ".log";  // (dt / 1000 | 0) is the same as Math.floor(Date.now() / 1000)
    return self._currFile;
}

DA_FileManager.prototype.ValidStream = function (bs)
{
    var self = this;
    var curr_time = Date.now() - self._beginDay;
    var result = (curr_time - self._buffer_time < buf_delay) && (bs < max_buf_size);
//    console.log('DA_FileManager.ValidStream: curr_time=' + curr_time + ' last_ts=' + self._last_ts + ' buffer_time=' + self._buffer_time
//                + ' buf_delay=' + buf_delay + ' bs=' + bs + 'max_buf_size=' + max_buf_size  + ' result=' + result);
    if (result === false) self._buffer_time = curr_time;
    return result;
}


DA_FileManager.prototype.ValidFile = function (fs)
{
    var self = this;
    var curr_time = Date.now() - self._beginDay;
    var result = (fs < max_file_size) && (curr_time - self._last_ts < file_delay);
//    console.log('DA_FileManager.ValidFile: curr_time=' + curr_time + ' last_ts=' + self._last_ts + ' file_delay=' + file_delay
//        + ' buf_delay=' + buf_delay + ' file size=' + fs + 'max_buf_size=' + max_buf_size  + ' result=' + result);
    return result;
}

DA_FileManager.prototype.ChangeDate = function ()
{
    var self = this;
    var curr_time = Date.now() - self._beginDay;
    return curr_time < DAY_SECS;
}

DA_FileManager.prototype.BeginDay = function ()
{
    return this._beginDay;
}

// module.exports = DA_FileManager;
exports.DAFileManager = function DAFileManager (root, pfx, dt, bs) {
    var daf = new DA_FileManager(root, pfx, dt, bs);
//    console.log('DAFileManager root=' + root + ' prefix=' + pfx + ' dt=' + dt + ' bs=' + bs);
    daf.Init();
    return daf;
}
