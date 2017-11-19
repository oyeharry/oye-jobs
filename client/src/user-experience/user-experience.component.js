'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import Auth from '../auth/auth.module';
import { ExperienceResource } from '../experience/experience.service';

import './user-experience.css';

export class UserExperience {
  // @ngInject
  constructor(Auth, Experience, $mdDialog, $mdToast) {
    this.Experience = Experience;
    this.Auth = Auth;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.simpleToast = this.$mdToast.simple();
  }

  showEditDialog(event, experience, onComplete) {
    this.$mdDialog.show({
      controller: ($scope, $mdDialog) => {
        'ngInject';
        $scope.experience = experience;
        var startDate =
          experience.startDate && experience.startDate.date.split('-');
        var endDate = experience.endDate && experience.endDate.date.split('-');
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
            $scope.experience.startDate = {
              date: `${$scope.startYear}-${$scope.startMonth}`
            };
          }

          if ($scope.endYear && $scope.endMonth) {
            $scope.experience.endDate = {
              date: `${$scope.endYear}-${$scope.endMonth}`
            };
          }
        };

        $scope.setLocation = location => {
          $scope.experience.location = location;
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
            onComplete($scope.experience, form);
          }
        };
      },
      template: require('./user-experience-edit.dialog.html'),
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: true
    });
  }

  onUpdate(event, experience) {
    experience = angular.merge({}, experience);
    this.showEditDialog(event, experience, experience => {
      let expReq;
      let uid =
        this.Auth.getCurrentUser().id === this.userId ? 'me' : this.userId;

      if (experience.id) {
        expReq = this.Experience.updateUserExperience(
          { id: experience.id, uid },
          experience
        );
      } else {
        expReq = this.Experience.addUserExperience({ uid }, experience);
      }

      expReq.$promise
        .then(() => {
          this.Experience
            .getUserExperience({ uid })
            .$promise.then(experience => {
              this.experiences = experience;
            });

          this.$mdDialog.hide();
        })
        .catch(() => {
          this.$mdToast.show(
            this.simpleToast.textContent('Failed to save experience.')
          );
        });
    });
  }

  onDelete(event, experience) {
    var confirm = this.$mdDialog
      .confirm()
      .title('Delete Experience')
      .textContent('Are you sure you want to delete this experience?')
      .ariaLabel('Confirm Experience Delete')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this.$mdDialog.show(confirm).then(
      () => {
        let uid =
          this.Auth.getCurrentUser().id === this.userId ? 'me' : this.userId;
        this.Experience
          .deleteUserExperience({ id: experience.id, uid })
          .$promise.then(() => {
            this.experiences.splice(this.experiences.indexOf(experience), 1);
          })
          .catch(() => {
            this.$mdToast.show(
              this.simpleToast.textContent('Failed to delete experience.')
            );
          });
      },
      () => {}
    );
  }
}

export default angular
  .module('directives.userExperience', [ngMaterial, Auth, ngMessages])
  .factory('Experience', ExperienceResource)
  .component('userExperience', {
    template: require('./user-experience.html'),
    controller: UserExperience,
    bindings: {
      experiences: '<',
      userId: '<'
    }
  }).name;
