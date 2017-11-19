'use strict';

// @ngInject
export function authInterceptor($rootScope, $q, $cookies, $injector) {
  var state;

  return {
    // add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      let token = $cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },

    // Intercept 401s and redirect you to signin
    responseError(response) {
      if (response.status === 401) {
        state = state || $injector.get('$state');
        state.go('signin');
        // remove any stale token
        $cookies.remove('token');
      }
      return $q.reject(response);
    }
  };
}
