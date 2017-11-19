'use strict';

// @ngInject
export function ExperienceResource($resource) {
  return $resource(
    '/api/experiences/:id/:controller/:uid',
    {
      id: '@id'
    },
    {
      addUserExperience: {
        method: 'POST',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      getUserExperience: {
        isArray: true,
        method: 'GET',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      updateUserExperience: {
        method: 'PUT',
        params: {
          controller: 'users',
          uid: 'me'
        }
      },
      deleteUserExperience: {
        method: 'DELETE',
        params: {
          controller: 'users',
          uid: 'me'
        }
      }
    }
  );
}
