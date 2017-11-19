'use strict';

import angular from 'angular';

import manageComponent from './manage.component';
import ngMessages from 'angular-messages';
import { RoleResource } from './role.service.js';
import { ScopeResource } from './scope.service.js';

export default angular
  .module('modules.manage', [manageComponent, ngMessages])
  .factory('Role', RoleResource)
  .factory('Scope', ScopeResource).name;
