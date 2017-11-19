'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('forgotPassword', {
    url: '/forgot-password',
    component: 'forgotPassword'
  });
}
