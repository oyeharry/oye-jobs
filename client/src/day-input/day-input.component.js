'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import { UtilService } from '../util/util.service';

export class DayInput {
  // @ngInject
  constructor(Util) {
    this.Util = Util;
  }

  $onChanges(obj) {
    if (this.form[this.name] && obj.month && obj.month.currentValue) {
      this.updateDay();
    }
  }

  updateDay() {
    let m = parseInt(this.month, 10);
    let day = this.day;
    let dayInput = this.form[this.name];

    if (dayInput) {
      if (
        (m && day && day.length === 2 && /\D/.test(day)) ||
        !this.Util.isValidMonthDay(m, parseInt(day, 10))
      ) {
        dayInput.$setValidity('invalid', false);
      } else {
        dayInput.$setValidity('invalid', true);
      }
    }

    if (/(\d){1,2}/.test(day)) {
      this.onUpdate({ day });
    }
  }
}

export default angular
  .module('directives.dayInput', [ngMaterial, ngMessages])
  .factory('Util', UtilService)
  .component('dayInput', {
    template: require('./day-input.html'),
    controller: DayInput,
    bindings: {
      month: '<',
      day: '<',
      label: '@',
      name: '@',
      form: '<',
      onUpdate: '&',
      required: '<'
    }
  }).name;
