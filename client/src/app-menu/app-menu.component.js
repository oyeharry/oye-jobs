'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';

import './app-menu.css';
import '../auth/auth.module.js';

export class AppMenu {
  // @ngInject
  constructor(Auth) {
    this.Auth = Auth;
  }
}

export default angular
  .module('directives.appMenu', [ngMaterial, uiRouter])
  .component('appMenu', {
    template: require('./app-menu.html'),
    controller: AppMenu
  }).name;
