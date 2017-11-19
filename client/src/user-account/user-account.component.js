'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import 'angular-validation-match';
import Flow from '@flowjs/flow.js';
//i know its weired but ng-flow require global. Need to find better solution
window.Flow = Flow;
import '@flowjs/ng-flow';

import Auth from '../auth/auth.module';
import Croppie from '../croppie/croppie.directive';
import { ChangePhotoDialogService } from './change-photo.service';
import { ChangePasswordDialogService } from './change-password.service';
import { AccountSettingDialogService } from './account-setting.service';
import { ImgPreviewDialogService } from '../img-preview-dialog/img-preview-dialog.service';
import phoneInput from '../phone-input/phone-input.component';

import './user-account.css';

export class UserAccount {
  // @ngInject
  constructor(
    Auth,
    User,
    $changePhotoDialog,
    $changePasswordDialog,
    $accountSettingDialog,
    $imgPreviewDialog
  ) {
    this.User = User;
    this.Auth = Auth;
    this.$changePhotoDialog = $changePhotoDialog;
    this.$changePasswordDialog = $changePasswordDialog;
    this.$accountSettingDialog = $accountSettingDialog;
    this.$imgPreviewDialog = $imgPreviewDialog;
  }

  previewPhoto(event) {
    var photoUrl = '/assets/images/' + this.user.photo;
    this.$imgPreviewDialog.show(event, this.user.name, photoUrl);
  }

  getImgUrl(img) {
    return img ? '/assets/images/' + img : null;
  }

  getUId() {
    return this.Auth.getApiUserId(this.user.id);
  }

  refreshData() {
    let userPromise;
    if (this.getUId() === 'me') {
      userPromise = this.Auth.reloadCurrentUser();
    } else {
      userPromise = this.User.get({ id: this.user.id }).$promise;
    }

    return userPromise.then(user => {
      this.user = user;
    });
  }

  onAccountSetting(event, user) {
    this.$accountSettingDialog.show(event, user).then(
      () => {
        this.refreshData();
      },
      () => {}
    );
  }

  onEditPhoto(event, user) {
    this.$changePhotoDialog.show(event, user).then(
      () => {
        this.refreshData();
      },
      () => {}
    );
  }
}

export default angular
  .module('directives.userAccount', [
    ngMaterial,
    ngMessages,
    'validation.match',
    Croppie,
    'flow',
    phoneInput
  ])
  .component('userAccount', {
    template: require('./user-account.html'),
    controller: UserAccount,
    bindings: {
      user: '<'
    }
  })
  .factory('$changePhotoDialog', ChangePhotoDialogService)
  .factory('$changePasswordDialog', ChangePasswordDialogService)
  .factory('$accountSettingDialog', AccountSettingDialogService)
  .factory('$imgPreviewDialog', ImgPreviewDialogService).name;
