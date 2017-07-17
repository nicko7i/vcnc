/*
 *    Copyright (C) 2015-2017    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/**
 *  Defines routes for every API v2 operation.
 *  @module
 */
/* eslint-disable import/no-extraneous-dependencies */

const fulfill202 = require('../../../vcnc-core/src/lib/fulfill202.js').fulfill202;
const CnctrqClient = require('../../../js-extension/build/Release/cnctrq_client.node').CnctrqClient;

const cnctrqClient = new CnctrqClient();
const grid = require('../../../vcnc-core/src/lib/grid.js');
const config = require('../../../vcnc-core/src/lib/configuration.js');

//
//  Inject latency for testing
//
function latency() {
  if (config.test.latency === undefined || config.test.latency === 0) {
    return Promise.resolve();
  }
  const p = new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      config.test.latency * 1000);
  });
  return p;
}

function convertVtrqID(map) {
  return Object.assign({}, map, { vtrq_id: parseInt(map.vtrq_id, 10) });
}

function convertMapVtrqID(maps) {
//  for (let i = 0; i < maps.length; i++) {
//  	convertVtrqID(maps[i]);
//  }
//
  return maps(e => convertVtrqID(e));
}

//
//  Converts a workspace in PIDL JSON format into a workspace in REST JSON
//  format.
//
function workspace(jsonIn, name) {
  const jsonWs = JSON.parse(jsonIn.ws);
  const jsonResult = {
    workspace: Object.assign({}, jsonWs, { name, maps: convertMapVtrqID(jsonWs.maps) }),
  };
  //  console.log(`workspace: jsonResult: ${JSON.stringify(jsonResult)}`);
  return jsonResult;
}
//
//  Converts the PIDL format for workspace children into the REST format.
//
function workspaceChildren(jsonIn) {
  const children = jsonIn.ws_children;
  //
  //  If there are no children at all return an empty array.
  if (children === '') {
    return { children: [] };
  }
  const jsonChildren = JSON.parse(children);
  return {
    children:
      jsonChildren.children.map(e => Object.assign(
        {},
        e,
        {
          maps: convertMapVtrqID(e.maps),
        })),
  };
}
//
function namespace(jsonIn, p) {
  const ns = jsonIn.ns;
  const jsonNs = JSON.parse(ns);
  const jsonResult = {
    name: p,
    stat: jsonNs.stat,
  };
  return jsonResult;
}

//
//  Constructs and returns an object which represents the operation's outcome.
//
//  The return value has two top-level properties. 'status' contains the
//  operation's http status code, and 'body' is the HTTP response body.
//
function adapter(fromRpc, onSuccess, onFailure) {
  const status = fromRpc.http_status;
  const rtn = {
    status,
    body: {},
  };
  rtn.body.error_sym = fromRpc.error_sym;
  //
  const successful = (200 <= status && status < 300); // eslint-disable-line yoda
  const moreProperties = successful ? onSuccess : onFailure;
  if (successful === false) {
    rtn.body.message = fromRpc.error_description_brief;
  }
  Object.assign(rtn.body, moreProperties);
  return rtn;
}

/** Defines our endpoints
 * @param app The express.router which implements our functionality.
 */
module.exports = (app) => {
  //
  //  Returns the collection of grid job records
  //
  app.get('/grid/jobs', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => grid.getJobs())
        .then(result => result.toArray())
        .then((result) => {
          if (result) {
            cb(adapter({
              http_status: 200,
              error_sym: 'OK',
              error_description_brief: 'Request processed',
            }, {
              job_names: result.map(e => e.id),
            }));
          } else {
            // Something went wrong
            cb(adapter({
              http_status: 500,
              error_sym: 'EREMOTEIO',
              error_description_brief: 'Server Error',
            }));
          }
        })
        .catch((err) => {
          //  Error from database
          cb(adapter({
            http_status: 500,
            error_sym: 'EPROTO',
            error_description_brief: 'Server Error',
          }, {}, { server_msg: err.toString() }));
        });
      });
  });

  //
  //  Creates a grid job record
  //
  app.post('/grid/job/:job_id', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          //
          //  The grid job tells us the name of the workspace specification
          //  used by the job.  Here we get the associated spec, which we will
          //  also store in the database.
          //
          cnctrqClient.workspace_get(
            req.body.vtrq_id,
            req.body.workspace_name,
            (result) => {
              if (result.http_status === 200) {
                grid.createJob(
                  req.pathParams.job_id,
                  { workspace_name: req.body.workspace_name, workspace_spec: workspace(result) })
                .then(() => {
                  cb(adapter({
                    http_status: 200,
                    error_sym: 'OK',
                    error_description_brief: 'Request Processed',
                  }));
                })
                .catch((err) => {
                  //  Error from database
                  cb(adapter({
                    http_status: 500,
                    error_sym: 'EPROTO',
                    error_description_brief: 'Server Error',
                  }, {}, { server_msg: err.toString() }));
                });
              } else if (result.error_sym === 'ENOENT') {
                //  Error from cnctrq client
                cb(adapter(Object.assign(
                  result,
                  { message: `Workspace ${req.body.workspace_name} not found` })));
              } else {
                cb(adapter(result));
              }
            });
        });
      });
  });
  //
  //  Returns a grid job record
  //
  app.get('/grid/job/:job_id', (req, res) => {
    const jobId = req.pathParams.job_id;

    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => grid.getJob(jobId))
        .then((result) => {
          if (result) {
            cb(adapter({
              http_status: 200,
              error_sym: 'OK',
              error_description_brief: 'Request processed',
            }, {
              job: result.job_spec,
            }));
          } else {
            // job ID was not found
            cb(adapter({
              http_status: 404,
              error_sym: 'ENOENT',
              error_description_brief: `Job '${jobId}' not found`,
            }));
          }
        })
        .catch((err) => {
          //  Error from database
          cb(adapter({
            http_status: 500,
            error_sym: 'EPROTO',
            error_description_brief: 'Server Error',
          }, {}, { server_msg: err.toString() }));
        });
      });
  });
  //
  //  Deletes a grid job record
  //
  app.delete('/grid/job/:job_id', (req, res) => {
    const jobId = req.pathParams.job_id;
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => grid.deleteJob(jobId))
        .then((result) => {
          if (result.deleted === 1) {
            cb(adapter({
              http_status: 200,
              error_sym: 'OK',
              error_description_brief: 'Request processed',
            }));
          } else {
            cb(adapter({
              http_status: 404,
              error_sym: 'ENOENT',
              error_description_brief: `Job '${jobId}' not found`,
            }));
          }
        })
        .catch((err) => {
          cb(adapter({
            http_status: 500,
            error_sym: 'EPROTO',
            error_description_brief: 'Server Error',
          }, {}, { server_msg: err.toString() }));
        });
      });
  });
  //
  //  Vector delete node
  //
  app.post('/vtrq/:vtrq_id/delete_nodes', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.remove(
            req.pathParams.vtrq_id,
            req.body.delete_paths,
            req.query.recursive,
            (result) => {
              cb(adapter(result, { result: result.result }));
            });
        });
      });
  });

  //
  //  Vector metadata Copy
  //
  app.post('/vtrq/:vtrq_id/meta_copy/', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.meta_copy(
            req.pathParams.vtrq_id,
            req.query.overwrite,
            req.body.copy_paths,
            (result) => {
              cb(adapter(result, { result: result.result }));
            });
        });
      });
  });

  app.delete('/vtrq/:vtrq_id/namespace/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.remove(
            req.pathParams.vtrq_id,
            [req.pathParams.url_path],
            req.query.recursive,
            (result) => {
              if (result.http_status === 200) {
                cb(adapter(result, result.result[0]));
              } else {
                cb(adapter(result));
              }
            });
        });
      });
  });

  app.get('/vtrq/:vtrq_id/namespace/:url_path/children', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.list(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              cb(adapter(result, { result: result.result }));
            });
        });
      });
  });

  app.get('/vtrq/:vtrq_id/namespace/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.getattr(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,

            (result) => {
              if (result.http_status !== 200) {
                cb(adapter(result));
              } else {
                cb(adapter(result, namespace(result, req.pathParams.url_path)));
              }
            });
        });
      });
  });

  //
  //
  //
  app.post('/vtrq/:vtrq_id/namespace/:path/mkdir', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.mkdir(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            req.query.mode,
            req.query.parents,
            (result) => {
              cb(adapter(result, { result: result.result }));
            });
        });
      });
  });

  //
  //  Shutdown TRQ
  //
  app.delete('/vtrq/:vtrq_id/service', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.shutdown_vtrq(
            req.pathParams.vtrq_id,
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Start an invariant chain reduction process.
  //
  app.post('/vtrq/:vtrq_id/icr/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.icr_run(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Get the status of an invariant chain reduction.
  //
  app.get('/vtrq/:vtrq_id/icr', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.icr_wait(
            req.pathParams.vtrq_id,
            0,  // wait for finish mode.
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Cancel invariant chain reduction process.
  //
  app.delete('/vtrq/:vtrq_id/icr', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.icr_wait(
            req.pathParams.vtrq_id,
            1,  // "cancel" mode
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Request storage info from  TRQ.
  //
  app.get('/vtrq/:vtrq_id/storage/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.trq_statistic(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              cb(adapter(result, { result: result.result,
                sum_st_size: result.sum_st_size,
                sum_extents: result.sum_extents,
              }));
            });
        });
      });
  });

  //
  //  Discover VP IDs having certain qualities
  //
  app.get('/vtrq/:vtrq_id/vps', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.vp_find(
            req.pathParams.vtrq_id,
            req.query.vp_host,
            req.query.mount_point,
            (result) => {
              // TODO: this is probably something else now.
              cb(adapter(result, { items: result.vp_ids }));
            });
        });
      });
  });

  //
  //  Discover VP IDs having certain qualities
  //  (Deprecated v1-style)
  //
  app.get('/vtrq/:vtrq_id/vp', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.vp_find(
            req.pathParams.vtrq_id,
            req.query.vp_host,
            req.query.mount_point,
            (result) => {
              cb(adapter(result, { vp_ids: result.vp_ids }));
            });
        });
      });
  });

  //
  //  Retrieve information about a specific VP
  //
  app.get('/vtrq/:vtrq_id/vp/:vp_id', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.vp_properties(
            req.pathParams.vtrq_id,
            req.pathParams.vp_id,
            (result) => {
              cb(adapter(
                result,
                {
                  // TODO update to match v2api.yaml
                  gid: result.gid,
                  hostname: result.hostname,
                  mount_point: result.mount_point,
                  uid: result.uid,
                  user: result.user,
                  workspace: result.workspace,
                }));
            });
        });
      });
  });
  //
  //  Retrieve the workspaces names at this workspace path.
  //
  app.get('/vtrq/:vtrq_id/workspace/:url_path/children', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.workspace_children(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              if (result.http_status === 200) {
                cb(adapter(result, workspaceChildren(result)));
              } else {
                cb(adapter(result));
              }
            });
        });
      });
  });

  //
  //  Retrieves the workspace specification at this path.
  //
  app.get('/vtrq/:vtrq_id/workspace/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.workspace_get(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              //
              //  We use JSON.parse(..) because we receive the workspace specification
              //  from the RPC as a JSON string rather than an object. Code at
              //  this level manipulates objects.
              //
              if (result.http_status === 200) {
                cb(adapter(result, workspace(result, req.pathParams.url_path)));
              } else {
                cb(adapter(result));
              }
            });
        });
      });
  });

  //
  //  Updates a workspace specification at this path.
  //  'put' is implicitly "overwrite: true".  It is an error 'put'
  //  to a workspace that doesn't exist.
  //
  app.put('/vtrq/:vtrq_id/workspace/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.workspace_put(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            JSON.stringify(req.body.spec),
            req.query.push,
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Sets a workspace specification at this path.
  //
  app.post('/vtrq/:vtrq_id/workspaces', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.workspace_set(
            req.pathParams.vtrq_id,
            req.body.name,
            JSON.stringify(req.body),
            req.query.overwrite,
            req.query.push,
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });

  //
  //  Deletes a workspace specification at this path.
  //
  app.delete('/vtrq/:vtrq_id/workspace/:url_path', (req, res) => {
    fulfill202(
      req,
      res,
      (cb) => {
        latency()
        .then(() => {
          cnctrqClient.workspace_delete(
            req.pathParams.vtrq_id,
            req.pathParams.url_path,
            (result) => {
              cb(adapter(result));
            });
        });
      });
  });
};
