/*
 *    Copyright (C) 2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
'use strict'; // eslint-disable-line strict
const config = require('./configuration.js');
const r = require('rethinkdb');
const json = require('JSON');
//
const redis = new Redis(config.redis.connection);
const fulfillmentUrl = `${config.fulfill202.baseUrl}${config.fulfill202.route}`;
//
//  Redis schema
//
//  The fulfillment feature has two elements: an integer 'next identifier' and
//  and a collection of (identifier, hash) pairs, where 'identifier' is
//  an integer and 'hash' has three elements: 'body', 'delivery' and 'status'.
//
//  'body' is the literal (JSON) text of the response body; 'delivery' is
//  either 'pending', 'completed' or 'failed'; 'status' is the HTTP status
//  code returned by the original (now deferred delivery) operation.
//

/**
 *  Creates a new grid job information entry.
 *
 *  @return {promise} A promise whose value an object.
 */
function createJob(job_id) {
  //
  //  Create the temporary resource in the DB
  //
  //  ... perform a transaction that increments the index; stores the resource's
  //  initial value, and returns the index's pre-increment value.
  //
  // console.log('inside CreateFulfillmentResource');
  const p = redis.incr('fulfill202.index')
    .then((idx) => {
      // console.log('CreateFulfillmentResource processing idx');
      const key = `fulfill202.${idx}`;
      redis.multi()
        .hset(key, 'delivery', 'pending')
        //
        //  Give the back-end (vtrq) a day to respond. Not infinite, because
        //  we want Redis to be able to clean up if the resource is orphaned.
        //
        .expire(key, 60 * 60 * 24)
        .exec();
      return idx;
    })
    .catch((e) => {
      console.log('caught', e);
    });
  return p;
}

/**
 *  Fetches the grid job information.
 *
 *  @param {integer} id The numberic resource identifier
 *  @return {promise} A promise that delivers an object.
 */
function getJob(id, spec) {
  const key = `fulfill202.${id}`;
  const p = redis.hgetall(key)
    .then((result) => {
      // console.log(`fetch ${key} w/`, result);
      if (Object.keys(result).length) {
        //  ... found
        return result;
      }
      //  ... not found
      return ({
        status: 410,
        body: { error_sym: 'ENOENT', message: 'Gone' },
        delivery: 'failed',
      });
    });
  return p;
}

/**
 *  Deletes the specified grid job.
 *
 *  @param {integer} id The numberic resource identifier
 *  @return {promise} A promise that delivers an object.
 */
function deleteJob(id) {
  const key = `fulfill202.${id}`;
  const p = redis.hgetall(key)
  .then((result) => {
    // console.log(`fetch ${key} w/`, result);
    if (Object.keys(result).length) {
      //  ... found
      return result;
    }
    //  ... not found
    return ({
      status: 410,
      body: { error_sym: 'ENOENT', message: 'Gone' },
      delivery: 'failed',
    });
  });
  return p;
}

/**
 *  Delete the temporary resource at a given numeric id.
 *
 *  @param {string} id The resource identifier
 *  @return {promise} A promise that delivers an object.
 */
module.exports = {
  createJob,
  getJob,
  deleteJob,
};
