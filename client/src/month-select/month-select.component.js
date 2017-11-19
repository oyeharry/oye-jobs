'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';

export class MonthSelect {
  // @ngInject
  constructor() {}
}

export default angular
  .module('directives.monthSelect', [ngMaterial])
  .component('monthSelect', {
    template: require('./month-select.html'),
    controller: MonthSelect,
    bindings: {
      value: '@',
      label: '@',
      required: '<',
      onMonthChange: '&'
    }
  }).name;
