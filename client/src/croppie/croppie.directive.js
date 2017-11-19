'use strict';

import angular from 'angular';
import Croppie from 'croppie';

import 'croppie/croppie.css';

import { CroppieService } from './croppie.service';

//@ngInject
function CroppieDirective($croppie) {
  return {
    restrict: 'E',
    template: '<div class="croppie-wrapper"></div>',
    scope: {
      options: '=',
      imgUrl: '@',
      componentId: '@'
    },
    link: function(scope, elem) {
      let options = angular.merge(
        {
          viewport: { width: 200, height: 200, type: 'circle' },
          boundary: { height: 300 },
          showZoomer: true,
          enableOrientation: true
        },
        scope.options
      );

      let croppie = new Croppie(elem[0], options);
      if (!angular.isUndefined(scope.componentId)) {
        $croppie.set(scope.componentId, croppie);
      }

      scope.$watch('imgUrl', function() {
        if (scope.imgUrl) {
          croppie.bind({
            url: scope.imgUrl
          });
        }
      });
    }
  };
}

export default angular
  .module('directives.croppie', [])
  .directive('croppie', CroppieDirective)
  .factory('$croppie', CroppieService).name;
