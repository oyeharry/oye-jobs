'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import uiRouter from '@uirouter/angularjs';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import { RoleResource } from './role.service.js';
import routes from './manage-roles.routes';

import './manage-roles.css';

export class ManageRoles {
  // @ngInject
  constructor(Auth, Role, $mdDialog, $mdToast) {
    this.Auth = Auth;
    this.Role = Role;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
  }

  showRoleEditDialog(event, title, roleEdit, scopes, onComplete) {
    this.$mdDialog.show({
      controller: ($scope, $mdDialog) => {
        'ngInject';
        $scope.roleEdit = roleEdit;
        $scope.title = title;
        $scope.roleEdit.scopes = scopes;
        $scope.onCancelClick = () => {
          $mdDialog.hide();
        };
        $scope.saveRole = form => {
          form.name.$setValidity('exist', true);
          form.name.$setValidity('wentWrong', true);
          if (form.$valid) {
            let updateScopes = $scope.roleEdit.scopes.filter(
              scope => scope.enabled
            );
            onComplete($scope.roleEdit.name, updateScopes, form);
          }
        };
      },
      template: require('./role-edit.dialog.html'),
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    });
  }

  onAddRoleBtn(event) {
    var roleScopes = this.scopes.map(scope => {
      return {
        id: scope.id,
        description: scope.description,
        enabled: false
      };
    });

    this.showRoleEditDialog(
      event,
      'Add New Role',
      { name: '' },
      roleScopes,
      (name, scopes, form) => {
        this.Role
          .save({
            name,
            scopes
          })
          .$promise.then(role => {
            this.$mdDialog.hide();
            this.roles.unshift(role);
          })
          .catch(err => {
            if (err.data.roleAlreadyExist) {
              form.name.$setValidity('exist', false);
            } else {
              form.name.$setValidity('wentWrong', false);
            }
          });
      }
    );
  }

  onRoleSettingBtn(event, role) {
    let roleScopeList = role.scopes.map(scope => scope.id);
    let roleScopes = this.scopes.map(scope => {
      return {
        id: scope.id,
        description: scope.description,
        enabled: roleScopeList.indexOf(scope.id) !== -1
      };
    });
    let roleEdit = { id: role.id, name: role.name };

    this.showRoleEditDialog(
      event,
      'Role Setting',
      roleEdit,
      roleScopes,
      (name, scopes, form) => {
        this.Role
          .updateRole({ id: role.id }, { name: role.name, scopes })
          .$promise.then(updatedRole => {
            this.$mdDialog.hide();
            role.scopes = scopes;
            this.onRoleUpdate({ role: updatedRole });
            this.$mdToast.show(
              this.simpleToast.textContent('Role scopes updated.')
            );
          })
          .catch(err => {
            if (err.data && err.data.roleAlreadyExist) {
              form.name.$setValidity('exist', false);
            } else {
              form.name.$setValidity('wentWrong', false);
            }
          });
      }
    );
  }

  onRoleDeleteBtn(event, role) {
    var confirm = this.$mdDialog
      .confirm()
      .textContent(`Are you sure you want to delete role "${role.name}"?`)
      .ariaLabel('Delete role dialog')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    var deleteRoleId = role.id;
    this.$mdDialog.show(confirm).then(
      () => {
        return role
          .$delete()
          .then(() => {
            this.onRoleDelete({ roleId: deleteRoleId });
            this.roles.splice(this.roles.indexOf(role), 1);
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent(
                `Failed to delete role "${role.name}".`
              )
            );
          });
      },
      () => {}
    );
  }
}

export default angular
  .module('directives.manageRoles', [ngMaterial, uiRouter, Auth, ngMessages])
  .factory('Role', RoleResource)
  .config(routes)
  .component('manageRoles', {
    template: require('./manage-roles.html'),
    controller: ManageRoles,
    bindings: {
      roles: '<',
      scopes: '<',
      onRoleUpdate: '&', //fire when any role updated
      onRoleDelete: '&' //fire when any role deleted
    }
  }).name;
