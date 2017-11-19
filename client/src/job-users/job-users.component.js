'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import Auth from '../auth/auth.module';
import routes from './job-users.routes';
import { JobResource } from '../job/job.service.js';

import './job-users.css';

export class JobApplicants {
  // @ngInject
  constructor(Auth, $state, $mdDialog, $mdToast) {
    this.Auth = Auth;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
  }
}

export default angular
  .module('directives.jobUsers', [ngMaterial, uiRouter, Auth])
  .config(routes)
  .factory('Job', JobResource)
  .component('jobUsers', {
    template: require('./job-users.html'),
    controller: JobApplicants,
    bindings: {
      job: '<'
    }
  }).name;
