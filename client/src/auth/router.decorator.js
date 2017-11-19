'use strict';

// @ngInject
export function routerDecorator($rootScope, $transitions, $timeout, Auth) {
  // Redirect to signin if route requires auth and the user is not logged in, or doesn't have required role

  $transitions.onStart({}, function(trans) {
    var to = trans.$to();
    var $state = trans.router.stateService;
    var promise;

    if (typeof to.authenticate === 'string') {
      promise = Auth.hasScopeAsync(to.authenticate).then(has => {
        if (has) {
          return;
        }

        return Auth.isLoggedInAsync().then(is => {
          return $state.target(is ? 'jobs' : 'signin');
        });
      });
    } else if (to.authenticate) {
      promise = Auth.isLoggedInAsync().then(is => {
        if (is) {
          return;
        }

        return $state.target('signin');
      });
    }

    // default delay used for slide down animation
    var delay = 0;
    $rootScope.routing = true;
    if (promise) {
      return $timeout(delay).then(() => promise);
    } else {
      return $timeout(delay);
    }

  });

  $transitions.onFinish({}, function() {
    $rootScope.routing = false;
  });
}
