'use strict';

import express from 'express';
import http from 'http';

import sqldb from './sqldb';
import config from './config/environment';
import seedDataIfRequired from './config/seed';
import log from './components/log';

const app = express();
const server = http.createServer(app);

require('./config/express').default(app);
require('./routes').default(app);

function startServer() {
  server.listen(config.port, config.ip, () => {
    log(
      'Express server is listening on %d, in %s mode.',
      config.port,
      app.get('env')
    );
  });
}

sqldb.sequelize
  .authenticate()
  .then(
    () => {
      return sqldb.sequelize
        .sync({ force: config.seedDB })
        .then(seedDataIfRequired)
        .then(startServer);
    },
    err => {
      log('Failed to establish database connection', err);
    }
  )
  .catch(err => {
    log('Failed to initialize app: ', err);
  });

// Expose app
exports = module.exports = app;
