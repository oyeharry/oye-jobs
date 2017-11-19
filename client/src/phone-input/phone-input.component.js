'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

export class PhoneInput {
  // @ngInject
  constructor() {
    
  }

  $onInit() {
    this.pattern = this.pattern || '\\b\\d{10,15}\\b';
    this.title = this.title || 'Phone number should be between 10 to 15 digits only';
  }

  updatePhone(value) {
    if(new RegExp(this.pattern).test(this.value)) {
      this.onUpdate({ value });
    }
  }
}

export default angular
  .module('directives.phoneInput', [ngMaterial, ngMessages])  
  .component('phoneInput', {
    template: require('./phone-input.html'),
    controller: PhoneInput,
    bindings: {
      value: '<',
      name: '@',
      label: '@',
      pattern: '@',
      form: '<',
      onUpdate: '&',
      required: '<',
      title:' @'
    }
  }).name;
