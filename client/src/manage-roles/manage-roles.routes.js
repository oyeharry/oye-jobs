'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('manageRoles', {
    url: '/manage/roles/',
    component: 'manageRoles',
    authenticate: 'roles:write|roles:read',
    resolve: {
      roles: function(Auth, Role) {
        'ngInject';
        return Auth.hasScope('roles:read') ? Role.query().$promise : [];
      },
      scopes: function(Auth, Scope) {
        'ngInject';
        return Auth.hasScope('scopes:read') ? Scope.query().$promise : [];
      }
    }
  });
}
