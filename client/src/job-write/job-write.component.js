'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './job-write.routes';
import searchInput from '../search-input/search-input.component.js';
import { JobTypeResource } from '../job-type/job-type.service';
import { JobDomainResource } from '../job-domain/job-domain.service';

import './job-write.css';

export class JobWrite {
  // @ngInject
  constructor(Auth, Job, $state) {
    this.Auth = Auth;
    this.Job = Job;
    this.$state = $state;        
  }

  postJob(form) {
    form.name.$setValidity('wentWrong', true);
    if (form.$valid) {
      let jobPostFn = this.jobDetail.id ? 'updateJob' : 'save';

      this.Job
        [jobPostFn](this.jobDetail)
        .$promise.then(job => {
          this.$state.go('jobDetail', { id: job.id });
        })
        .catch(() => {
          form.name.$setValidity('wentWrong', false);
        });
    }
  }

  setLocation(location) {
    this.jobDetail.location = location;
  }
}

export default angular
  .module('directives.jobWrite', [
    ngMaterial,
    uiRouter,
    Auth,
    searchInput,
    ngMessages
  ])
  .config(routes)
  .factory('JobType', JobTypeResource)
  .factory('JobDomain', JobDomainResource)
  .component('jobWrite', {
    template: require('./job-write.html'),
    controller: JobWrite,
    bindings: {
      jobDetail: '<',
      jobWrite: '<',
      jobTypes: '<',
      jobDomains: '<'
    }
  }).name;
