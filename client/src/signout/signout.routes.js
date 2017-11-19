'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('signout', {
    url: '/signout?referrer',
    referrer: 'jobs',
    template: '',
    controller($state, Auth) {
      'ngInject';

      var referrer =
        $state.params.referrer || $state.current.referrer || 'jobs';
      Auth.logout();
      $state.go(referrer);
    }
  });
}
