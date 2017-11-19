'use strict';

// @ngInject
export function JobTypeResource($resource) {
  return $resource(
    '/api/job-types/:id/',
    {
      id: '@id'
    },
    {}
  );
}
