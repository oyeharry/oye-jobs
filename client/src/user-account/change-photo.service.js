'use strict';

export class ChangePhotoController {
  // @ngInject
  constructor(Auth, User, $mdDialog, $mdToast, $croppie, user) {
    this.progressComplete = true;
    this.User = User;
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$croppie = $croppie;
    this.user = user;
    this.simpleToast = this.$mdToast.simple();
  }

  onRemovePhoto() {
    return this.User
      .removePhoto({ id: this.Auth.getApiUserId(this.user.id) })
      .$promise.then(() => {
        this.user.photo = null;
        this.$mdDialog.hide();
      })
      .catch(() => {
        this.$mdToast.show(
          this.simpleToast.textContent('Photo remove failed!')
        );
      });
  }

  photoFileAdded($file) {
    this.progressComplete = false;
    let fileReader = new FileReader();
    fileReader.onload = event => {
      this.progressComplete = true;
      this.editingPhotoUrl = event.target.result;
    };
    fileReader.readAsDataURL($file.file);
  }

  photoUploaded() {
    this.progressComplete = true;
    this.$mdDialog.hide();
  }

  onPhotoUploadError() {
    this.$mdToast.show(this.simpleToast.textContent('Photo upload failed!'));
    this.progressComplete = true;
    this.saving = false;
  }

  onDoneBtn($flow) {
    this.saving = true;
    this.$croppie
      .get('profilePhoto')
      .result({ type: 'blob', circle: false, size: { width: 400 } })
      .then(blob => {
        blob.name = 'photo.png';
        $flow.cancel();
        $flow.addFile(blob);
        $flow.upload();
        this.progressComplete = false;
      });
  }
}

// @ngInject
export function ChangePhotoDialogService($mdDialog) {
  return {
    show(event, user) {
      return $mdDialog.show({
        controller: ChangePhotoController,
        controllerAs: '$ctrl',
        template: require('./change-photo.dialog.html'),
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { user },
        clickOutsideToClose: true
      });
    }
  };
}
