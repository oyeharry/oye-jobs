'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import Auth from '../auth/auth.module';
import routes from './user-jobs.routes';

import './user-jobs.css';

export class UserJobs {
  // @ngInject
  constructor(Auth, $state, $mdDialog, $mdToast) {
    this.Auth = Auth;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
  }

  onDeleteBtnClick(event, job) {
    var confirm = this.$mdDialog
      .confirm()
      .textContent(`Are you sure you want to revoke application "${job.name}"?`)
      .ariaLabel('Revoke application dialog')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this.$mdDialog.show(confirm).then(
      () => {
        this.Auth
          .removeJob(job)
          .then(() => {
            this.userJobs.splice(this.userJobs.indexOf(job), 1);
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent(
                `Failed to revoke application "${job.name}".`
              )
            );
          });
      },
      () => {}
    );
  }
}

export default angular
  .module('directives.userJobs', [ngMaterial, uiRouter, Auth])
  .config(routes)
  .component('userJobs', {
    template: require('./user-jobs.html'),
    controller: UserJobs,
    bindings: {
      userJobs: '<'
    }
  }).name;
