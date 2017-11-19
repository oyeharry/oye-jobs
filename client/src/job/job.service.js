'use strict';

// @ngInject
export function JobResource($resource) {
  return $resource(
    '/api/jobs/:id/:controller',
    {
      id: '@id'
    },
    {
      updateJob: {
        method: 'PUT'
      },
      getLength: {
        method: 'GET',
        params: {
          controller: 'length'
        }
      },
      getUsers: {
        method: 'GET',
        params: {
          controller: 'users'
        }
      }
    }
  );
}
