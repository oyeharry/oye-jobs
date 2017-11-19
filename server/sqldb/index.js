/**
 * Sequelize initialization module
 */
'use strict';

import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// insert model below
db.User = db.sequelize.import('../api/user/user.model');
db.Role = db.sequelize.import('../api/role/role.model');
db.Scope = db.sequelize.import('../api/scope/scope.model');
db.Country = db.sequelize.import('../api/country/country.model');
db.Job = db.sequelize.import('../api/job/job.model');
db.Location = db.sequelize.import('../api/location/location.model');
db.JobType = db.sequelize.import('../api/job-type/job-type.model');
db.JobDomain = db.sequelize.import('../api/job-domain/job-domain.model');
db.Education = db.sequelize.import('../api/education/education.model');
db.Experience = db.sequelize.import('../api/experience/experience.model');

db.RoleScope = db.sequelize.define('role_scope');
db.UserJob = db.sequelize.define('user_job', {}, { timestamps: true });

db.Job.belongsTo(db.Location, { as: 'location' });
db.Job.belongsTo(db.JobType, { as: 'jobType' });
db.Job.belongsTo(db.JobDomain, { as: 'jobDomain' });
db.Job.belongsTo(db.User, { as: 'author' });
db.User.belongsTo(db.Role, { as: 'role' });
db.Location.belongsTo(db.Country, { as: 'country' });

db.Role.hasMany(db.User);
db.Role.belongsToMany(db.Scope, { through: db.RoleScope });
db.Scope.belongsToMany(db.Role, { through: db.RoleScope });

db.Job.belongsToMany(db.User, { through: db.UserJob });
db.User.belongsToMany(db.Job, { through: db.UserJob });

db.User.hasMany(db.Education);
db.User.hasMany(db.Experience);
db.Experience.belongsTo(db.Location, { as: 'location' });

module.exports = db;
