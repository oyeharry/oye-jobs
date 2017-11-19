'use strict';

// @ngInject
export function routeConfig($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}

// @ngInject
export function mdIconConfig($mdIconProvider) {
  // Register the user `avatar` icons
  $mdIconProvider
    .defaultIconSet('./assets/svg/app-icons.svg')
    .iconSet('avatars', './assets/svg/avatars.svg', 168);
}

// @ngInject
export function mdAppThemeConfig($mdThemingProvider) {
  var neonRedMap = $mdThemingProvider.extendPalette('green', {
    '500': '#4caf50'
  });

  $mdThemingProvider.definePalette('oyeJobRed', neonRedMap);

  // Register the user `avatar` icons
  $mdThemingProvider
    .theme('default')
    .primaryPalette('oyeJobRed')
    .accentPalette('green');
}
