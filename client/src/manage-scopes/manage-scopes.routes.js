'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('manageScopes', {
    url: '/manage/scopes/',
    component: 'manageScopes',
    authenticate: 'scopes:write',
    resolve: {
      scopes: function(Auth, Scope) {
        'ngInject';
        return Auth.hasScope('scopes:read') ? Scope.query().$promise : [];
      }
    }
  });
}
