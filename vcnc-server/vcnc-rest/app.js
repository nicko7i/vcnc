/*
 *    Copyright (C) 2015-2016    IC Manage Inc.
 *
 *    See the file 'COPYING' for license information.
 */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-extraneous-dependencies */
// Set the DEBUG environment variable to enable debug output
// process.env.DEBUG = 'swagger:middleware';

const config = require('../vcnc-core/src/lib/configuration');
//
//  Express
const express = require('express');
//
//  Swagger
const Middleware = require('swagger-express-middleware');
//
//  Websockets
const WebSocket = require('ws');
const WebSocketHandler = require('../vcnc-core/src/lib/websocket');
//
//  Storage Polling
//  (Eventually polling will be performed by vcnc-core)
const storagePolling = require('../vcnc-core/src/lib/pollStorageStats');
//
const path = require('path');
const http = require('http');
const cors = require('cors');
const grid = require('../vcnc-core/src/lib/grid');
const rethink = require('../vcnc-core/src/lib/rethink');
//
//  Initialize the C++ extension
//
const extensionPath = '../js-extension/build/Release/cnctrq_client';
const CnctrqClient = require(extensionPath).CnctrqClient;
const cnctrqClient = new CnctrqClient();
cnctrqClient.call_me_first(path.join(__dirname, '..'));
const fulfill202 = require('../vcnc-core/src/lib/fulfill202');

function installStaticContent(app) {
  //
  //  Configure the static content
  //
  app.use(
    '/v1/doc/api',
    express.static(path.join(__dirname, 'static/swagger-ui/dist'))
  );
  app.use(
    '/v1/doc',
    express.static(path.join(__dirname, 'static/doc-html'))
  );
  app.use(
    '/v1/doc/api/spec',
    express.static(path.join(__dirname, 'src/api/v1api.json'))
  );
  //
  //  ... and for v1a
  //
/*
  app.use(
    '/v1a/doc/api',
    express.static(path.join(__dirname, 'static/swagger-ui/dist'))
  );
  app.use(
    '/v1a/doc',
    express.static(path.join(__dirname, 'static/doc-html'))
  );
  app.use(
    '/v1a/doc/api/spec',
    express.static(path.join(__dirname, 'src/api/v1aapi.json'))
  );
*/
  //
  //  ... and for v2
  //
  app.use(
    '/v2/doc/api',
    express.static(path.join(__dirname, 'static/swagger-ui/dist'))
  );
  app.use(
    '/v2/doc',
    express.static(path.join(__dirname, 'static/doc-html'))
  );
  app.use(
    '/v2/doc/api/spec',
    express.static(path.join(__dirname, 'src/api/v2api.json'))
  );
}

function installCORS(app) {
  //
  //  Enable CORS
  //
  app.use(cors({ credentials: true, origin: true }));
}

function install202Fulfillment(app) {
  //
  //  Install the 202 fulfillment controller
  //
  app.get(`${fulfill202.route}/:id`, (req, res) => {
    // console.log('routed to fulfill ');
    // const result = fulfill202.fetchFulfillmentResource(req.params.id);
    fulfill202.fetchFulfillmentResource(req.params.id)
    .then((result) => {
      // console.log('about to fulfill ', result);
      res.status(200).send(result);
    });
  });
}

function installErrorGenerator(app) {
  //
  //  An undocumented error generator for testing.
  //
  app.use('/_fail/sync', () => {
    throw new Error('mock synchronous error for testing');
  });
}

function installErrorResponses(app) {
  // ERROR HANDLING ====================================================
  //
  // This error handling follows the policy that every response body shall
  // contain a JSON object having both an 'error_sym' and a 'message'
  // property.
  //
  // When the server runs in 'development' mode, the object will also
  // have a 'stack' property whose value is the stack trace.
  //
  // The vCNC server can throw exception/errors in three different contexts:
  // a) synchronously to Express handling (app.use(..)); b) during an Express
  // callback; and c) within libuv as part of processing a node/V8 extension.
  //
  // The code here handles the ((a)) context.  Handling the ((b)) context
  // is very cumbersome - it involves try/catch within every route handling
  // method.  Case ((c)) is similar to ((b)), only within the C++ extension
  // context.
  //
  // The policy is to not handle the ((b)) and ((c)) cases.  The vCNC server
  // will terminate, and in production will be automatically restarted. Testing
  // will have to discover internal bugs which can generate such exceptions.
  // This will be sufficient as long as there is no user (REST) input which can
  // generate such errors.
  //
  // http://stackoverflow.com/a/15913211 is a good explanation of the issues.
  //
  function errorHandler(err, req, res, next, stack) {
    if (err.status === 404) {
      res
      .status(err.status)
      .json({ error_sym: 'ENOENT', message: err.message });
    } else {
      res
      .status(err.status || 500)
      .json({
        error_sym: 'EREMOTEIO',
        message: err.message,
        stack,
      });
      next(err);  // logs this error to the server console
    }
  }

  //
  // During development, a stack trace is sent to the client.
  // An error always causes the server to log the stack to stdout/stderr.
  //
  app.use((err, req, res, next) => {
    errorHandler(
      err,
      req,
      res,
      next,
      app.get('env') === 'development' ? err.stack : undefined
    );
  });
}

function installLogging(app) {
  //
  //  Very, very crude URL logging
  //
  app.use((req, res, next) => {
    if ('VELSTOR_VCNC_LOG_REQUESTS' in process.env) {
      console.log(req.method, req.originalUrl); // eslint-disable-line no-console
    }
    next();
  });
}

function installRouters(app) {
  //
  //  Install routers for each API version and variation
  //
  const v1Router = express.Router(); // eslint-disable-line new-cap
  require(path.join(__dirname, 'src/routes/v1'))(v1Router); // eslint-disable-line global-require
  app.use('/v1', v1Router);
  //
//  const v1aRouter = express.Router(); // eslint-disable-line new-cap
//  require(path.join(__dirname, 'src/routes/v1a'))(v1aRouter); // eslint-disable-line global-require
//  app.use('/v1a', v1aRouter);
  //
  const v2Router = express.Router(); // eslint-disable-line new-cap
  require(path.join(__dirname, 'src/routes/v2'))(v2Router); // eslint-disable-line global-require
  app.use('/v2', v2Router);
  //
  //  Install a test router
  //
  const testRouter = express.Router(); // eslint-disable-line new-cap
  require(path.join(__dirname, 'src/routes/test'))(testRouter); // eslint-disable-line global-require
  app.use('/v1/_test', testRouter);
  //
  // Catch undefined URLs (404) and forward to error handler
  //
  app.use((req, res, next) => {
    //
    //  Swagger-ui needs the .../api/spec URLs to 404 and
    //  also return the default response.
    //
    if (req.originalUrl === '/v1/doc/api/spec') {
      next();
//    } else if (req.originalUrl === '/') {
//      next();
//      res.redirect('/v1a/doc');
    } else if (req.originalUrl === '/') {
      res.redirect('/v2/doc');
    } else {
      //
      //  Otherwise, if we go here, we missed
      //  a URL that was outside the swagger-express-middleware
      //  domain, so perform our uniform JSON response handling.
      //
      const err = new Error(`URL ${req.originalUrl} not found.`);
      err.status = 404;
      next(err);
    }
  });
}

function serveWebAdmin() {
  //
  //  Serve the web admin console on its own port.
  if (config.web.enabled) {
    const admin = express();
    admin.use(
      '/',
      express.static(path.join(__dirname, 'static/vcnc-web'))
    );
    const adminPort = parseInt(config.server.port, 10) + parseInt(config.web.offset, 10);
    console.log('INFO: accepting vcnc-web connections on port', adminPort); // eslint-disable-line
    http.createServer(admin).listen(adminPort);
  }
}

function serveREST(app) {
  //
  //  Announce we are ready.
  //
  const port = config.server.port;
  //
  // Create http server
  const server = http.createServer(app);
  //
  //  Create the websocket service
  const wss = new WebSocket.Server({ server });
  wss.on('connection', ws => WebSocketHandler.makeHandler()(ws));
  //
  //
  server.listen(port, () => {
    console.log('INFO: accepting REST connections on port %d', server.address().port); // eslint-disable-line
  });
}

function configureSwaggerMiddleware(app, schema) {
  return new Promise((resolve) => {
    const middleware = new Middleware(app);
    middleware.init(path.join(__dirname, schema), () => {
      //
      //  Metadata middleware
      //
      app.use(middleware.metadata());
      //
      //  Parse the request, convert to appropriate data types.
      //
      app.use(middleware.parseRequest());
      //
      //  Validate the request against the API definition, returning HTTP codes
      //  as appropriate.
      //
      app.use(middleware.validateRequest());
      //
      resolve();
    });
  });
}

/**
 *  Top-level Express application object.
 *  @module
 */
module.exports = (() => {
  //
  const app = express();

  install202Fulfillment(app);
  installCORS(app);
  installErrorGenerator(app);
  installLogging(app);
  installStaticContent(app);
  //
  //  This is a chain of promises.  It ensures that each of these mostly
  //  asynchronous methods have completed before then next is invoked.
  //
  //  rethink.init() must be called first.
  //  installRouters, etc, must be called last.
  //  The order of the others doesn't matter.
  //
  rethink.init()
  .then(() => grid.init())
  .then(() => WebSocketHandler.init())
  .then(() => storagePolling.init())
  .then(() => configureSwaggerMiddleware(app, 'src/api/v1api.json'))
//  .then(() => configureSwaggerMiddleware(app, 'src/api/v1aapi.json'))
  .then(() => configureSwaggerMiddleware(app, 'src/api/v2api.json'))
  .then(() => {
    installRouters(app);
    installErrorResponses(app);
    serveREST(app);
  })
  .catch((err) => {
    console.log(err); // eslint-disable-line
    console.log('Exiting...'); // eslint-disable-line
    process.exit(0);
  });
  //
  //  The web administration console is independent of all the above.
  //
  serveWebAdmin();
})();

