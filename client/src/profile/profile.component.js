'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './profile.routes';

import userAccount from '../user-account/user-account.component';
import userEducation from '../user-education/user-education.component';
import userExperience from '../user-experience/user-experience.component';

import './profile.css';

export class Profile {
  // @ngInject
  constructor($state, $mdSidenav, Auth) {
    this.Auth = Auth;
  }
}

export default angular
  .module('directives.profile', [
    ngMaterial,
    uiRouter,
    Auth,
    ngMessages,
    userAccount,
    userEducation,
    userExperience
  ])
  .config(routes)
  .component('profile', {
    template: require('./profile.html'),
    controller: Profile,
    bindings: {
      user: '<'
    }
  }).name;
