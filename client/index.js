import angular from 'angular';
import oyeJobsApp from './src/oye-jobs-app/oye-jobs-app.component.js';

angular.element(document).ready(() => {
  angular.bootstrap(document, [oyeJobsApp], {
    strictDi: true
  });
});
