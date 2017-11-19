'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('manageUsers', {
    url: '/manage/users/',
    component: 'manageUsers',
    authenticate: 'users:write',
    resolve: {
      roles: function(Auth, Role) {
        'ngInject';
        return Auth.hasScope('roles:read') ? Role.query().$promise : [];
      },
      totalUsers: function(User, $transition$) {
        'ngInject';
        return User.getLength($transition$.params('to')).$promise;
      }
    }
  });
}
