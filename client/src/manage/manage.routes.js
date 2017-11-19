'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('manage', {
    url: '/manage/:tabId',
    component: 'manage',
    authenticate: 'users:write|roles:write|scopes:write|jobs:write'
  });
}
