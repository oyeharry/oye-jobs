'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('userJobs', {
    url: '/jobs/applied',
    component: 'userJobs',
    resolve: {
      userJobs: function(User) {
        'ngInject';
        return User.getJobs().$promise;
      }
    }
  });
}
