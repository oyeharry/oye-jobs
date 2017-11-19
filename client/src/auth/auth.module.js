'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';

import uiRouter from '@uirouter/angularjs';

import { AuthService } from './auth.service.js';
import { UserResource } from './user.service.js';
import { authInterceptor } from './interceptor.service.js';
import { routerDecorator } from './router.decorator.js';

// @ngInject
function addInterceptor($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular
  .module('modules.auth', [ngCookies, uiRouter])
  .config(addInterceptor)
  .factory('Auth', AuthService)
  .factory('User', UserResource)
  .factory('authInterceptor', authInterceptor)
  .run(routerDecorator).name;
