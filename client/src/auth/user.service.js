'use strict';

// @ngInject
export function UserResource($resource) {
  return $resource(
    '/api/users/:id/:controller', {
      id: '@id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      changeRole: {
        method: 'PUT',
        params: {
          controller: 'role'
        }
      },
      update: {
        method: 'PUT'
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      getJobs: {
        method: 'GET',
        isArray: true,
        params: {
          id: 'me',
          controller: 'jobs'
        }
      },
      removePhoto: {
        method: 'DELETE',
        params: {
          id: 'me',
          controller: 'photo'
        }
      },
      getLength: {
        method: 'GET',
        params: {
          controller: 'length'
        }
      }
    }
  );
}
