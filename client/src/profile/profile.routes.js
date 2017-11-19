'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider
    .state('profile', {
      url: '/profile',
      component: 'profile',
      authenticate: true,
      resolve: {
        user: function(Auth) {
          'ngInject';
          return Auth.getCurrentUserAsync();
        }
      }
    })
    .state('profileUser', {
      url: '/profile/:id',
      component: 'profile',
      authenticate: true,
      resolve: {
        user: function(User, $transition$) {
          'ngInject';
          var params = $transition$.params('to');
          return User.get({ id: params.id }).$promise;
        }
      }
    });
}
