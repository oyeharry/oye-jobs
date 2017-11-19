'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('jobUsers', {
    url: '/jobs/:id/applicants',
    component: 'jobUsers',
    resolve: {
      job: function(Job, $transition$) {
        'ngInject';
        var params = $transition$.params('to');
        return Job.getUsers({ id: params.id }).$promise;
      }
    }
  });
}
