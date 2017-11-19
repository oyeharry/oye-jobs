'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider.state('jobDetail', {
    url: '/jobs/:id?apply',
    component: 'jobDetail',
    resolve: {
      jobDetail: function(Auth, Job, $transition$) {
        'ngInject';
        var params = $transition$.params('to');
        return Job.get({ id: params.id }).$promise;
      },
      previousStateName: function($transition$) {
        'ngInject';
        return $transition$.from().name;
      }
    }
  });
}
