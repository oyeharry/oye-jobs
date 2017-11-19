'use strict';

// Development specific configuration
// ==================================
module.exports = {
  sequelize: {
    uri: 'mysql://root:@localhost:3306/oye_jobs_app_dev'
  },

  secrets: {
    session: 'awesome-oye-jobs-app-secret'
  },

  seedDB: true,

  port: process.env.PORT || 8000
};
