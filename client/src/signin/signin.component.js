'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import routes from './signin.routes';

import forgotPassword from '../forgot-password/forgot-password.component';

import './signin.css';

export class Signin {
  // @ngInject
  constructor($state, $mdSidenav, Auth, $location) {
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.Auth = Auth;
    this.$location = $location;
  }

  $onInit() {
    this.$mdSidenav('mdcAppMenu').close(); // will be close only if menu is not locked
  }

  login(form) {
    form.password.$setValidity('wrong', true);
    form.email.$setValidity('wrong', true);
    form.password.$setValidity('unknown', true);
    form.email.$setValidity('unknown', true);

    if (form.$valid) {
      this.Auth
        .login({
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$location.url(this.$state.params.referrer || '/jobs');
        })
        .catch(err => {
          var data = err.data;
          if (data.wrongPassword) {
            form.password.$setValidity('wrong', false);
          } else if (data.wrongEmail) {
            form.email.$setValidity('wrong', false);
          } else {
            form.password.$setValidity('unknown', false);
            form.email.$setValidity('unknown', false);
          }
        });
    }
  }
}

export default angular
  .module('directives.signin', [
    ngMaterial,
    uiRouter,
    Auth,
    ngMessages,
    forgotPassword
  ])
  .config(routes)
  .component('signin', {
    template: require('./signin.html'),
    controller: Signin,
    bindings: {
      email: '<',
      password: '<'
    }
  }).name;
