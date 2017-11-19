'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import Auth from '../auth/auth.module';
import routes from './job-detail.routes';

import './job-detail.css';

export class JobDetail {
  // @ngInject
  constructor($state, Auth, User, $mdToast, $location, $mdDialog) {
    this.Auth = Auth;
    this.$state = $state;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$location = $location;
    this.simpleToast = this.$mdToast.simple();
  }

  $onInit() {
    this.jobDetail.$promise.then(job => {
      if (
        this.previousStateName == 'signin' &&
        this.$state.params.apply === '1' &&
        !this.Auth.hasJob(job)
      ) {
        this.applyJob(job).then(() => {
          // this.$location.search('apply', null).replace();
        });
      }
    });
  }

  applyJob(job) {
    return this.Auth.isLoggedInAsync().then(isLogin => {
      if (isLogin) {
        return this.Auth
          .addJob(job)
          .then(() => {
            this.$mdToast.show(this.simpleToast.textContent('Job Applied.'));
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent('Failed to apply job.')
            );
          });
      } else {
        this.$state.go('signin', {
          referrer: this.$state.href('jobDetail', { id: job.id, apply: 1 })
        });
      }
    });
  }

  onRevokeJob(job) {
    var confirm = this.$mdDialog
      .confirm()
      .textContent(`Are you sure you want to revoke application '${job.name}'?`)
      .ariaLabel('Revoke application dialog')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this
      .$mdDialog
      .show(confirm)
      .then(() => {

        this
          .Auth
          .removeJob(job)
          .then(() => {
            this.$mdToast.show(
              this.simpleToast.textContent('Application Revoked.')
            );
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent('Failed to revoke application.')
            );
          });
      }, () => {});

  }
}

export default angular
  .module('directives.jobDetail', [ngMaterial, uiRouter, Auth])
  .config(routes)
  .component('jobDetail', {
    template: require('./job-detail.html'),
    controller: JobDetail,
    bindings: {
      jobDetail: '<',
      previousStateName: '@'
    }
  }).name;
