'use strict';

// @ngInject
export function JobDomainResource($resource) {
  return $resource(
    '/api/job-domains/:id/',
    {
      id: '@id'
    },
    {}
  );
}
