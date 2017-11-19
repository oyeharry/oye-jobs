'use strict';

export class ChangePasswordController {
  // @ngInject
  constructor(Auth, User, $mdDialog, userId) {
    this.User = User;
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.userId = userId;
  }

  onFormSubmit(form) {
    form.oldPassword.$setValidity('wrong', true);
    form.oldPassword.$setValidity('wentWrong', true);
    if (form.$valid) {
      this.User
        .changePassword(
          { id: this.userId },
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          }
        )
        .$promise.then(() => {
          this.$mdDialog.hide();
        })
        .catch(err => {
          if (err.data && err.data.wrong) {
            form.oldPassword.$setValidity('wrong', false);
          } else {
            form.oldPassword.$setValidity('wentWrong', false);
          }
        });
    }
  }
}

// @ngInject
export function ChangePasswordDialogService($mdDialog) {
  return {
    show(event, userId) {
      return $mdDialog.show({
        controller: ChangePasswordController,
        controllerAs: '$ctrl',
        template: require('./password-edit.dialog.html'),
        parent: angular.element(document.body),
        targetEvent: event,
        locals: { userId },
        clickOutsideToClose: true
      });
    }
  };
}
