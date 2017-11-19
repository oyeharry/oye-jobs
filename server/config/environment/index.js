'use strict';

import path from 'path';
import _ from 'lodash';

var rootPath = path.normalize(path.join(__dirname, '/../../..'));
var env = process.env;

// All configurations will extend these options
// ============================================
var all = {
  env: env.NODE_ENV,

  ip: '0.0.0.0',

  //Root path of the server
  root: rootPath,

  imagesPath: '/assets/images',

  // Should we populate the DB with data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: env.SESSION_SECRET
  },

  // Sequelize connection opions
  sequelize: {
    // 'mysql'|'sqlite'|'postgres'|'mssql'
    uri: env.DATABASE_URL,
    options: {
      logging: false,
      define: {
        timestamps: false,
        underscored: true
      }
    }
  },

  port: process.env.PORT || 9000
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require(`./${env.NODE_ENV}.js`) || {});
