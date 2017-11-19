'use strict';

// @ngInject
export function ScopeResource($resource) {
  return $resource('/api/scopes/:id', {
    id: '@id'
  });
}
