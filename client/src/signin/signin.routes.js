'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('signin', {
    url: '/signin?referrer',
    component: 'signin'
  });
}
