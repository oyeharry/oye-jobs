'use strict';

// @ngInject
export function CroppieService($log) {
  var croppies = {};

  return {
    set: function(id, croppie) {
      croppies[id] = croppie;
    },
    get: function(id) {
      if (angular.isUndefined(croppies[id])) {
        $log.warn(
          `Croppie with component id ${id} not found or it's not available yet!`
        );
        return {};
      }
      return croppies[id];
    }
  };
}
