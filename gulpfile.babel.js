'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import nodemon from 'nodemon';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from './webpack.config.js';
import browserSyncImport from 'browser-sync';
import stripAnsi from 'strip-ansi';
import del from 'del';
import lazypipe from 'lazypipe';
import _ from 'lodash';
import rs from 'run-sequence';
import opn from 'opn';

const runSequence = rs.use(gulp);
const browserSync = browserSyncImport.create();
const plugins = gulpLoadPlugins();
const serverPath = 'server';
const clientPath = 'client';
const paths = {
  dist: 'dist',
  client: {
    assets: `${clientPath}/assets/**/*`,
  },
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ]
  }
};

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: [
      'transform-class-properties',
      'transform-runtime'
    ]
  })
  .pipe(plugins.sourcemaps.write, '.');

function onServerLog(log) {
  /*eslint-disable*/
  console.log(
    plugins.util.colors.white('[') +
    plugins.util.colors.yellow('nodemon') +
    plugins.util.colors.white('] ') +
    log.message
  );
  /*eslint-enable*/
}

gulp.task('eslint', () => {
  return gulp
    .src([
      'server/**/*.js',
      'client/scripts/**/*.js',
      'client/**/*.html',
      'gulpfile.babel.js'
    ])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.if(!browserSync.active, plugins.eslint.failOnError()));
});

gulp.task('start:server:demo', () => {
  process.env.NODE_ENV = 'demo';
  nodemon(`-w ${serverPath} ${serverPath}`).on('log', onServerLog);
});

gulp.task('start:server', () => {
  process.env.NODE_ENV = 'development';
  nodemon(`-w ${serverPath} ${serverPath}`).on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = 'production';
  process.env.SESSION_SECRET = 'AWESOME_SECRET';
  console.log(`-w ${serverPath} ${serverPath}`);
  nodemon(`dist/${serverPath} app.js`).on('log', onServerLog);
});

gulp.task('start:client', () => {
  const config = require('./server/config/environment');
  const compiler = webpack(webpackConfig.get({ build: false }));
  const port = 3000;
  browserSync.init({
    proxy: `localhost:${config.port}`,
    plugins: ['bs-fullscreen-message'],
    open: false,
    //port: port,
    middleware: [
      webpackDevMiddleware(compiler, {
        noInfo: false,
        stats: {
          colors: true,
          timings: true,
          chunks: false
        },
        lazy: false,
        watchOptions: {
          aggregateTimeout: 1000,
          poll: true
        }
      })
    ]
  });

  /**
   * Reload all devices when bundle is complete
   * or send a fullscreen error message to the browser instead
   */
  var compiledFirstTime = true;
  compiler.plugin('done', function(stats) {
    if (compiledFirstTime) {
      opn(`http://localhost:${port}`);
      compiledFirstTime = false;
    }
    if (stats.hasErrors() || stats.hasWarnings()) {
      return browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000
      });
    }
    browserSync.reload();
  });
});

gulp.task('transpile:server', () => {
  return gulp
    .src(_.union(paths.server.scripts))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('serve', ['start:server', 'start:client']);
gulp.task('serve:demo', ['start:server:demo', 'start:client']);
gulp.task('serve:dist', cb => {
   runSequence(
      'build',
      'start:server:prod',
      cb
    );
});

gulp.task('webpack:dist', function() {
  const webpackDistConfig = webpackConfig.get({ build: true });
  return gulp
    .src(webpackDistConfig.entry.app)
    .pipe(webpackStream(webpackDistConfig, webpack))
    .on('error', (err) => {
      this.emit('end'); // Recover from errors
    })
    .pipe(gulp.dest(`${paths.dist}/public`));
});

gulp.task('build', cb => {
  runSequence(
    [
      'clean:dist',
      'clean:tmp'
    ],
    'transpile:server',
    'copy:assets',
    'copy:server',
    'webpack:dist',
    cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}`], { dot: true }));
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));

gulp.task('copy:assets', () => {
  return gulp.src([paths.client.assets])
    .pipe(gulp.dest(`${paths.dist}/public/assets`));
});

gulp.task('copy:server', () => {
  return gulp.src([
      'package.json'
    ], { cwdbase: true })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('default', ['build']);