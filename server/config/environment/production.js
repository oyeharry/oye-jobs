'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server port
  port: process.env.PORT || 9000,

  seedDB: process.env.SEED_DB || false
};
