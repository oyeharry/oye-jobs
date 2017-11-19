'use strict';

export class AccountSettingController {
  // @ngInject
  constructor(Auth, User, $mdDialog, user) {
    this.User = User;
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.user = user;
  }

  updateBirthDate(date) {
    this.user.birthDate.date = date;
  }

  onPhoneUpdate(value) {
    this.user.phone = value;
  }

  onFormSubmit(form) {
    form.email.$setValidity('exist', true);
    form.email.$setValidity('wentWrong', true);
    form.firstName.$setValidity('wentWrong', true);
    form.lastName.$setValidity('wentWrong', true);
    if (form.$valid) {
      this.User
        .update({ id: this.Auth.getApiUserId(this.user.id) }, this.user)
        .$promise.then(() => {
          this.$mdDialog.hide();
        })
        .catch(err => {
          if (err.data && err.data.emailAlreadyExist) {
            form.email.$setValidity('exist', false);
          } else {
            form.firstName.$setValidity('wentWrong', false);
            form.lastName.$setValidity('wentWrong', false);
            form.email.$setValidity('wentWrong', false);
          }
        });
    }
  }
}

// @ngInject
export function AccountSettingDialogService($mdDialog) {
  return {
    show(event, user) {
      return $mdDialog.show({
        controller: AccountSettingController,
        controllerAs: '$ctrl',
        template: require('./user-account-edit.dialog.html'),
        parent: angular.element(document.body),
        locals: { user: angular.copy(user.toJSON()) },
        targetEvent: event,
        clickOutsideToClose: true
      });
    }
  };
}
