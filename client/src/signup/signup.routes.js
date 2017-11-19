'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    component: 'signup'
  });
}
