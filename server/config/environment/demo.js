'use strict';

// Demo specific configuration
// ==================================
module.exports = {
  sequelize: {
    uri: 'mysql://admin:admin@10.11.0.102:3306/oye_jobs_app'
  },

  seedDB: true,

  port: process.env.PORT || 8000
};
