'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';

import uiRouter from '@uirouter/angularjs';

// app component imports
import {
  routeConfig,
  mdIconConfig,
  mdAppThemeConfig
} from './oye-jobs-app.config';
import appMenu from '../app-menu/app-menu.component';
import signin from '../signin/signin.component';
import signup from '../signup/signup.component';
import jobs from '../jobs/jobs.component';
import Auth from '../auth/auth.module';
import signout from '../signout/signout.module';
import profile from '../profile/profile.component';
import manage from '../manage/manage.component';
import jobDetail from '../job-detail/job-detail.component';
import jobWrite from '../job-write/job-write.component';

// app css imports
import 'angular-material/angular-material.css';
import './oye-jobs-app.css';

export class OyeJobsApp {
  // @ngInject
  constructor(Auth, $mdSidenav, $transitions, $rootScope) {
    this.Auth = Auth;
    this.$mdSidenav = $mdSidenav;
    this.$rootScope = $rootScope;

    $transitions.onStart({}, trans => {
      this.transitionLoaded = false;
      this.$mdSidenav('mdcAppMenu').close();
      trans.promise.finally(() => {
        this.transitionLoaded = true;
      });
    });
  }

  toggleMenu() {
    this.$mdSidenav('mdcAppMenu').toggle();
  }
}

export default angular
  .module('directives.oyeJobsApp', [
    ngCookies,
    ngResource,
    ngSanitize,
    uiRouter,
    ngMaterial,
    Auth,
    appMenu,
    signin,
    signup,
    signout,
    profile,
    manage,
    jobs,
    jobDetail,
    jobWrite
  ])
  .config(routeConfig)
  .config(mdIconConfig)
  .config(mdAppThemeConfig)
  .component('oyeJobsApp', {
    template: require('./oye-jobs-app.html'),
    controller: OyeJobsApp
  }).name;
