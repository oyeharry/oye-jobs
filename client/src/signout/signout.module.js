'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';

import uiRouter from '@uirouter/angularjs';

import Auth from '../auth/auth.module.js';
import routes from './signout.routes';

export default angular
  .module('modules.signout', [uiRouter, Auth])
  .config(routes)
  .run(function($rootScope) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(
      event,
      next,
      nextParams,
      current
    ) {
      if (
        next.name === 'logout' &&
        current &&
        current.name &&
        !current.authenticate
      ) {
        next.referrer = current.name;
      }
    });
  }).name;
