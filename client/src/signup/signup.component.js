'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import 'angular-validation-match';

import Auth from '../auth/auth.module';
import routes from './signup.routes';
import dateInputRow from '../date-input-row/date-input-row.component';
import phoneInput from '../phone-input/phone-input.component';

import './signup.css';

export class Signup {
  // @ngInject
  constructor($state, Auth, Util) {
    this.Auth = Auth;
    this.Util = Util;
    this.$state = $state;
    this.newUser = {};
  }

  updateBirthDate(date) {
    this.newUser.birthDate = { date };
  }

  onPhoneUpdate(phone) {
    this.newUser.phone = phone;
  }

  createUser(form) {
    form.email.$setValidity('exist', true);
    form.email.$setValidity('wentWrong', true);
    if (form.$valid) {
      this.Auth
        .createUser(this.newUser)
        .then(() => {
          this.$state.go('jobs');
        })
        .catch(err => {
          if (err.data.emailAlreadyExist) {
            form.email.$setValidity('exist', false);
          } else {
            form.email.$setValidity('wentWrong', false);
          }
        });
    }
  }
}

export default angular
  .module('directives.signup', [
    ngMaterial,
    uiRouter,
    Auth,
    ngMessages,
    'validation.match',
    dateInputRow,
    phoneInput
  ])
  .config(routes)
  .component('signup', {
    template: require('./signup.html'),
    controller: Signup,
    bindings: {}
  }).name;
