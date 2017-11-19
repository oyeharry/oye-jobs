'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('manageJobs', {
    url: '/manage/jobs?search&loc&locId',
    authenticate: 'jobs:write',
    component: 'manageJobs',
    resolve: {
      totalJobs: function(Job, $transition$) {
        'ngInject';
        return Job.getLength($transition$.params('to')).$promise;
      }
    }
  });
}
