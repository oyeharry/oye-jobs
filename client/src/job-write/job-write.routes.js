'use strict';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider
    .state('jobWriteEdit', {
      url: '/manage/jobs/edit/:id',
      component: 'jobWrite',
      authenticate: 'jobs:write',
      resolve: {
        jobDetail: function(Auth, Job, $transition$) {
          'ngInject';
          var params = $transition$.params('to');
          return Job.get({ id: params.id }).$promise;
        },

        jobTypes: function(JobType) {
          'ngInject';
          return JobType.query().$promise;
        },

        jobDomains: function(JobDomain) {
          'ngInject';
          return JobDomain.query().$promise;
        },

        jobWrite: function() {
          return { title: 'Edit Job' };
        }
      }
    })
    .state('jobWriteCreate', {
      url: '/manage/jobs/create',
      component: 'jobWrite',
      authenticate: 'jobs:write',
      resolve: {
        jobWrite: function() {
          return { title: 'Post New Job' };
        },

        jobTypes: function(JobType) {
          'ngInject';
          return JobType.query().$promise;
        },

        jobDomains: function(JobDomain) {
          'ngInject';
          return JobDomain.query().$promise;
        },

        jobDetail: function() {
          return {};
        }
      }
    });
}
