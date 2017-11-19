'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import { EducationResource } from '../education/education.service';

import './user-education.css';

export class UserEducation {
  // @ngInject
  constructor(Auth, Education, $mdDialog, $mdToast) {
    this.Education = Education;
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
  }

  showEditDialog(event, education, onComplete) {
    this.$mdDialog.show({
      controller: ($scope, $mdDialog) => {
        'ngInject';
        $scope.education = education;
        var startDate =
          education.startDate && education.startDate.date.split('-');
        var endDate = education.endDate && education.endDate.date.split('-');
        if (startDate) {
          $scope.startYear = startDate[0];
          $scope.startMonth = parseInt(startDate[1], 10);
        }
        if (endDate) {
          $scope.endYear = endDate[0];
          $scope.endMonth = parseInt(endDate[1], 10);
        }
        $scope.onCancelClick = () => {
          $mdDialog.hide();
        };

        $scope.updateDate = () => {
          if ($scope.startYear && $scope.startMonth) {
            $scope.education.startDate = {
              date: `${$scope.startYear}-${$scope.startMonth}`
            };
          }

          if ($scope.endYear && $scope.endMonth) {
            $scope.education.endDate = {
              date: `${$scope.endYear}-${$scope.endMonth}`
            };
          }
        };

        $scope.updateStartYear = val => {
          $scope.startYear = val;
          $scope.updateDate();
        };

        $scope.updateEndYear = val => {
          $scope.endYear = val;
          $scope.updateDate();
        };

        $scope.updateStartMonth = val => {
          $scope.startMonth = val;
          $scope.updateDate();
        };

        $scope.updateEndMonth = val => {
          $scope.endMonth = val;
          $scope.updateDate();
        };

        $scope.onFormSubmit = form => {
          if (form.$valid) {
            onComplete($scope.education, form);
          }
        };
      },
      template: require('./user-education-edit.dialog.html'),
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    });
  }

  onUpdate(event, education) {
    education = angular.merge({}, education);
    this.showEditDialog(event, education, education => {
      let eduReq;
      let uid =
        this.Auth.getCurrentUser().id === this.userId ? 'me' : this.userId;

      if (education.id) {
        eduReq = this.Education.updateUserEducation(
          { id: education.id, uid },
          education
        );
      } else {
        eduReq = this.Education.addUserEducation({ uid }, education);
      }

      eduReq.$promise
        .then(() => {
          this.Education.getUserEducation({ uid }).$promise.then(education => {
            this.education = education;
          });

          this.$mdDialog.hide();
        })
        .catch(() => {
          this.$mdToast.show(
            this.simpleToast.textContent('Failed to save education.')
          );
        });
    });
  }

  onDelete(event, education) {
    var confirm = this.$mdDialog
      .confirm()
      .title('Delete Education')
      .textContent('Are you sure you want to delete this education?')
      .ariaLabel('Confirm Education Delete')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this.$mdDialog.show(confirm).then(
      () => {
        let uid =
          this.Auth.getCurrentUser().id === this.userId ? 'me' : this.userId;
        this.Education
          .deleteUserEducation({ id: education.id, uid })
          .$promise.then(() => {
            this.education.splice(this.education.indexOf(education), 1);
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent('Failed to delete education.')
            );
          });
      },
      () => {}
    );
  }
}

export default angular
  .module('directives.userEducation', [ngMaterial, Auth, ngMessages])
  .factory('Education', EducationResource)
  .component('userEducation', {
    template: require('./user-education.html'),
    controller: UserEducation,
    bindings: {
      education: '<',
      userId: '<'
    }
  }).name;
