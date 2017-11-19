'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import { UtilService } from '../util/util.service';

export class YearInput {
  // @ngInject
  constructor(Util) {
    this.Util = Util;
  }

  updateYear() {
    let year = this.year;
    let yearInput = this.form[this.name];
    if (yearInput) {
      if (
        (year && year.length === 4 && /\D/.test(year)) ||
        this.Util.isValidYear(parseInt(year, 10))
      ) {
        yearInput.$setValidity('invalid', false);
      } else {
        yearInput.$setValidity('invalid', true);
      }
    }

    if (/(\d){4}/.test(year)) {
      this.onUpdate({ year });
    }
  }
}

export default angular
  .module('directives.yearInput', [ngMaterial, ngMessages])
  .factory('Util', UtilService)
  .component('yearInput', {
    template: require('./year-input.html'),
    controller: YearInput,
    bindings: {
      year: '<',
      name: '@',
      label: '@',
      form: '<',
      onUpdate: '&',
      required: '<'
    }
  }).name;
