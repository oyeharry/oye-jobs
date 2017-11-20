/**
 * Express configuration
 */

'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import passport from 'passport';
import enforce from 'express-sslify';

import config from './environment';

export default function(app) {
  var env = app.get('env');

  app.use(compression());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  if (env === 'production' || env === 'demo') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    app.use(favicon(path.join(config.root, 'public', 'assets', 'images', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
  }

  if (env === 'development') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(errorHandler()); /* Error handler - has to be last */
  }
}
