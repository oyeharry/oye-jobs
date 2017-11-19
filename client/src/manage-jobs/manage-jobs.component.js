'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './manage-jobs.routes';
import { JobResource } from '../job/job.service.js';
import { InfiniteItemsService } from '../infinite-items/infinite-items.service';

import jobUsers from '../job-users/job-users.component';

import './manage-jobs.css';

export class ManageJobs {
  // @ngInject
  constructor($mdDialog, $mdToast, Auth, Job, $state, $infiniteItems) {
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
    this.$state = $state;
    this.Job = Job;
    this.$infiniteItems = $infiniteItems;
  }

  $onInit() {

    this.infiniteJobs = this.$infiniteItems
      .getConfig({
        totalItems: this.totalJobs.length,
        queryParams: this.$state.params
      }, this.Job);
  }

  searchJobs(searchItem) {
    let params = angular.extend({}, this.$state.params, {
      search: searchItem && searchItem.name
    });
    this.$state.go('manageJobs', params);
  }

  searchJobsByLocation(searchItem) {
    let loc, locId;
    if (searchItem) {
      loc = searchItem.name;
      locId = searchItem.id;
    }
    let params = angular.extend({}, this.$state.params, { loc, locId });
    this.$state.go('manageJobs', params);
  }

}

export default angular
  .module('directives.manageJobs', [
    ngMaterial,
    uiRouter,
    Auth,
    ngMessages,
    jobUsers
  ])
  .config(routes)
  .factory('Job', JobResource)
  .factory('$infiniteItems', InfiniteItemsService)
  .component('manageJobs', {
    template: require('./manage-jobs.html'),
    controller: ManageJobs,
    bindings: {
      jobs: '<',
      totalJobs: '<'
    }
  }).name;
