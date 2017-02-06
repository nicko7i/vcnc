/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
'use strict'; // eslint-disable-line strict
const config = require('./configuration.js');
const r = require('rethinkdb');
const dbName = config.rethinkdb.connection.db;
const tableName = 'grid_jobs';
var cnxtn = null;

/**
 *  Initializes the grid module, creating a connection object
 *  and creating the database if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function init() {
  return r.connect(config.rethinkdb.connection)
  .then(conn => {
    cnxtn = conn;  // save the connection for later reuse
    return r.dbList().filter(v => {
      return v.eq(dbName);
    }).run(conn);
  })
  .then(lst => {
    //  Create the database if necessary.
    if (lst.length == 0) {
      return r.dbCreate(dbName).run(cnxtn);
    }
    return Promise.resolve();
  })
  .then(() => {
    //  Look for the table in the database
    return r.tableList().filter(v => {
      return v.eq(tableName);
    }).run(cnxtn);
  })
  .then(lst => {
    // Create the table if necessary.
    if (lst.length == 0) {
      return r.tableCreate(tableName).run(cnxtn);
    }
    return Promise.resolve();
  });
}

/**
 *  Creates a new grid job information entry.
 *
 *  @return {promise} A promise resolving to error status.
 */
function createJob(job_id, job_spec) {
  return r.table(tableName).insert({ id: job_id, job_spec }).run(cnxtn);
}

/**
 *  Fetches the grid job information.
 *
 *  @param {string} id The job identifier.
 *  @return {promise} A promise resolving to information about the job.
 */
function getJob(id) {
  return r.tabble(tableName).get(id).run(cnxtn);
}

/**
 *  Deletes the specified grid job.
 *
 *  @param {string} id The job identifier.
 *  @return {promise} A promise resolving to error status.
 */
function deleteJob(id) {
  return r.table(tableName).get(id).delete().run(cnxtn);
}

module.exports = {
  init,
  createJob,
  getJob,
  deleteJob,
};
