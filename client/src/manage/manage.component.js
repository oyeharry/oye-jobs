'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import Auth from '../auth/auth.module';
import routes from './manage.routes';
import manageUsers from '../manage-users/manage-users.component';
import manageRoles from '../manage-roles/manage-roles.component';
import manageScopes from '../manage-scopes/manage-scopes.component';
import manageJobs from '../manage-jobs/manage-jobs.component';

import './manage.css';

export class Manage {
  // @ngInject
  constructor(Auth) {
    this.Auth = Auth;
  }
}

export default angular
  .module('directives.manage', [
    ngMaterial,
    uiRouter,
    Auth,
    manageUsers,
    manageRoles,
    manageScopes,
    manageJobs
  ])
  .config(routes)
  .component('manage', {
    template: require('./manage.html'),
    controller: Manage,
    bindings: {}
  }).name;
