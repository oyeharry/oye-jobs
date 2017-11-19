'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import { UtilService } from '../util/util.service';
import monthSelect from '../month-select/month-select.component';
import dayInput from '../day-input/day-input.component';
import yearInput from '../year-input/year-input.component';

import './day-input-row.css';

export class DateInputRow {
  // @ngInject
  constructor(Util) {
    this.Util = Util;
  }

  $onInit() {
    if (/(\d){4}-(\d){2}-(\d){2}/.test(this.date)) {
      let s = this.date.split('-');
      this.year = s[0];
      this.month = parseInt(s[1], 10);
      this.day = s[2];
    }
  }

  updateDay(day) {
    this.day = day;
    this.updateDate();
  }

  updateYear(year) {
    this.year = year;
    this.updateDate();
  }

  updateDate() {
    let month = parseInt(this.month, 10);
    month = month < 10 ? '0' + month : month;

    let day = parseInt(this.day, 10);
    day = day < 10 ? '0' + day : day.toString();

    let date = `${this.year}-${month}-${day}`;
    if (/(\d){4}-(\d){2}-(\d){2}/.test(date)) {
      this.onDateUpdate({ date });
    }
  }

  updateMonth(month) {
    this.month = month;
    this.updateDate();
  }
}

export default angular
  .module('directives.dateInputRow', [
    ngMaterial,
    ngMessages,
    monthSelect,
    dayInput,
    yearInput
  ])
  .factory('Util', UtilService)
  .component('dateInputRow', {
    template: require('./date-input-row.html'),
    controller: DateInputRow,
    bindings: {
      date: '@',
      yearLabel: '@',
      monthLabel: '@',
      dayLabel: '@',
      dayName: '@',
      yearName: '@',
      form: '<',
      onDateUpdate: '&',
      required: '<'
    }
  }).name;
