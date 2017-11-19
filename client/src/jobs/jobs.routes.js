'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('jobs', {
    url: '/?search&loc&locId',
    component: 'jobs',
    resolve: {
      totalJobs: function(Job, $transition$) {
        'ngInject';
        var queryParams = angular.extend({ active: true }, $transition$.params('to'))
        return Job.getLength(queryParams).$promise;
      }
    }
  });
}
