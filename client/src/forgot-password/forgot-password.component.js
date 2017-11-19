'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './forgot-password.routes';

import './forgot-password.css';

export class Signin {
  // @ngInject
  constructor($state, $mdSidenav, Auth, $location, $mdDialog) {
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.Auth = Auth;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    this.$mdSidenav('mdcAppMenu').close(); // will be close only if menu is not locked
  }

  resetPassword(form, event) {
    form.email.$setValidity('wrong', true);
    form.email.$setValidity('unknown', true);

    if (form.$valid) {
      this.$mdDialog.show(
        this.$mdDialog
          .alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Email Sent')
          .textContent(
            'Reset email has been sent to your email address. Please check your email.'
          )
          .ariaLabel('Forgot Password Dialog')
          .ok('OK')
          .targetEvent(event)
      );
    }
  }
}

export default angular
  .module('directives.forgotPassword', [ngMaterial, uiRouter, Auth, ngMessages])
  .config(routes)
  .component('forgotPassword', {
    template: require('./forgot-password.html'),
    controller: Signin,
    bindings: {
      email: '<'
    }
  }).name;
