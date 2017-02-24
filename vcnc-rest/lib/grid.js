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
let cnxtn = null;

/**
 *  Initializes the grid module, creating a connection object
 *  and creating the database if necessary.
 *
 *  @return {promise} A promise fulfilled when the connection is ready.
 */
function init() {
  if (!config.test.enable_grid_jobs) return Promise.resolve();
  return r.connect(config.rethinkdb.connection)
  .then(conn => {
    cnxtn = conn;  // save the connection for later reuse
    return r.dbList().filter(v => v.eq(dbName)).run(conn);
  })
  .then(lst => {
    //  Create the database if necessary.
    if (lst.length === 0) {
      return r.dbCreate(dbName).run(cnxtn);
    }
    return Promise.resolve();
  })
  .then(() =>
    //  Look for the table in the database
    r.tableList().filter(v => v.eq(tableName)).run(cnxtn)
  )
  .then(lst => {
    // Create the table if necessary.
    if (lst.length === 0) {
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
function createJob(jobId, jobSpec) {
  return r.table(tableName).insert({
    id: jobId,
    job_spec: jobSpec,
    timestamp: r.now(),
  }).run(cnxtn);
}

/**
 *  Fetches the grid job information.
 *
 *  @param {string} id The job identifier.
 *  @return {promise} A promise resolving to information about the job.
 */
function getJob(id) {
  return r.table(tableName).get(id).run(cnxtn);
}

/**
 *  Fetches names of all grid jobs
 *
 *  @param {string} id The job identifier.
 *  @return {promise} A promise resolving to information about the jobs.
 */
function getJobs() {
  return r.table(tableName).pluck('id').run(cnxtn);
}

/**
 *  Deletes the specified grid job.
 *
 *  @param {string} id The job identifier.
 *  @return {promise} A promise resolving to error status.
 */
function deleteJob(id) {
  return r.table(tableName)
  .get(id)
  .delete()
  .run(cnxtn);
}

module.exports = {
  init,
  createJob,
  getJob,
  getJobs,
  deleteJob,
};
