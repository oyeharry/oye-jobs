'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';

import Auth from '../auth/auth.module';
import routes from './manage-users.routes';
import { InfiniteItemsService } from '../infinite-items/infinite-items.service';

import './manage-users.css';

export class ManageUsers {
  // @ngInject
  constructor(Auth, User, $mdDialog, $mdToast, $infiniteItems, $state) {
    this.Auth = Auth;
    this.User = User;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
    this.$infiniteItems = $infiniteItems;
    this.$state = $state;
  }

  $onInit() {

    this.infiniteUsers = this.$infiniteItems
      .getConfig({
        totalItems: this.totalUsers.length,
        loadingItemViews: 3,
        queryParams: this.$state.params
      }, this.User);
  }

  openRoleMenu($mdMenu, event) {
    $mdMenu.open(event);
  }

  setUserRole(role, user) {
    // this.$mdToast.show(this.simpleToast.textContent('Updating role...').hideDelay(0));
    this.User
      .changeRole({
        id: user.id
      }, {
        roleId: role.id
      })
      .$promise.then(() => {
        this.$mdToast.show(this.simpleToast.textContent('Role updated.'));
        user.role = role;
      })
      .catch(() => {
        this.$mdToast.show(
          this.simpleToast.textContent('Failed to update role.')
        );
      });
  }

  onDeleteBtnClick(event, user) {

    var confirm = this.$mdDialog
      .confirm()
      .textContent(`Are you sure you want to delete '${user.profile.name}'?`)
      .ariaLabel('Delete user dialog')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this
      .$mdDialog
      .show(confirm)
      .then(() => {
        var userName = user.profile.name;
        user
          .$delete()
          .then(() => {
            this.infiniteUsers.items.splice(this.infiniteUsers.items.indexOf(user), 1);
            this.infiniteUsers.totalItems = this.infiniteUsers.totalItems - 1;
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent(
                `Failed to delete '${userName}'.`
              )
            );
          });
      }, () => {});
  }
}

export default angular
  .module('directives.manageUsers', [ngMaterial, Auth])
  .config(routes)
  .factory('$infiniteItems', InfiniteItemsService)
  .component('manageUsers', {
    template: require('./manage-users.html'),
    controller: ManageUsers,
    bindings: {
      roles: '<',
      totalUsers: '<'
    }
  }).name;
