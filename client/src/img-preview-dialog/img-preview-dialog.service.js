'use strict';

export class ImgPreviewController {
  // @ngInject
  constructor($mdDialog, title, url) {
    this.$mdDialog = $mdDialog;
    this.title = title;
    this.url = url;
  }
}

// @ngInject
export function ImgPreviewDialogService($mdDialog) {
  return {
    show(event, title, url) {
      return $mdDialog.show({
        controller: ImgPreviewController,
        controllerAs: '$ctrl',
        template: require('./img-preview-dialog.html'),
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { title, url },
        clickOutsideToClose: true
      });
    }
  };
}
