'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './jobs.routes';
import { JobResource } from '../job/job.service.js';
import searchInput from '../search-input/search-input.component';
import userJobs from '../user-jobs/user-jobs.component';
import { InfiniteItemsService } from '../infinite-items/infinite-items.service';

import './jobs.css';

export class Jobs {
  // @ngInject
  constructor(Auth, Job, $state, $infiniteItems) {
    this.Auth = Auth;
    this.$state = $state;
    this.Job = Job;
    this.$infiniteItems = $infiniteItems;
  }

  $onInit() {
    this.infiniteJobs = this.$infiniteItems
      .getConfig({
        totalItems: this.totalJobs.length,
        queryParams: angular.extend({ active: true }, this.$state.params)
      }, this.Job);
  }

  searchJobs(searchItem) {
    let params = angular.extend({}, this.$state.params, {
      search: searchItem && searchItem.name
    });
    this.$state.go('jobs', params);
  }

  searchJobsByLocation(searchItem) {
    let loc, locId;
    if (searchItem) {
      loc = searchItem.name;
      locId = searchItem.id;
    }
    let params = angular.extend({}, this.$state.params, { loc, locId });
    this.$state.go('jobs', params);
  }
}

export default angular
  .module('directives.jobs', [
    ngMaterial,
    uiRouter,
    Auth,
    ngMessages,
    searchInput,
    userJobs
  ])
  .config(routes)
  .factory('Job', JobResource)
  .factory('$infiniteItems', InfiniteItemsService)
  .component('jobs', {
    template: require('./jobs.html'),
    controller: Jobs,
    bindings: {
      jobs: '<',
      totalJobs: '<'
    }
  }).name;
