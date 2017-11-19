'use strict';

// @ngInject
export function RoleResource($resource) {
  return $resource(
    '/api/roles/:id/',
    {
      id: '@id'
    },
    {
      updateRole: {
        method: 'PUT'
      }
    }
  );
}
