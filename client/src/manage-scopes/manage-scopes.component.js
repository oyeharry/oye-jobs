'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';

import Auth from '../auth/auth.module';
import { ScopeResource } from './scope.service.js';
import routes from './manage-scopes.routes';

import './manage-scopes.css';

export class ManageScopes {
  // @ngInject
  constructor($state, $mdSidenav, Auth) {
    this.Auth = Auth;
  }
}

export default angular
  .module('directives.manageScopes', [ngMaterial, Auth])
  .factory('Scope', ScopeResource)
  .config(routes)
  .component('manageScopes', {
    template: require('./manage-scopes.html'),
    controller: ManageScopes,
    bindings: {
      scopes: '<'
    }
  }).name;
