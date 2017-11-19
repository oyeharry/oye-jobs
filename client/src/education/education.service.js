'use strict';

// @ngInject
export function EducationResource($resource) {
  return $resource(
    '/api/education/:id/:controller/:uid',
    {
      id: '@id'
    },
    {
      addUserEducation: {
        method: 'POST',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      getUserEducation: {
        isArray: true,
        method: 'GET',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      updateUserEducation: {
        method: 'PUT',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      deleteUserEducation: {
        method: 'DELETE',
        params: {
          controller: 'users',
          uid: 'me'
        }
      }
    }
  );
}
