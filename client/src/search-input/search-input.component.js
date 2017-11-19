'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

export class SearchInput {
  // @ngInject
  constructor($http) {
    this.$http = $http;
  }

  searchLocation(q) {
    return this.$http
      .get(this.searchUrl, { params: { q } })
      .then(res => res.data);
  }

  onSelectedItemChange(searchItem) {
    this.onSearchChange({ searchItem });
  }
}

export default angular
  .module('directives.searchInput', [ngMaterial, ngMessages])
  .component('searchInput', {
    template: require('./search-input.html'),
    controller: SearchInput,
    bindings: {
      searchUrl: '@',
      label: '@',
      onSearchChange: '&',
      selectedItem: '<'
    }
  }).name;
