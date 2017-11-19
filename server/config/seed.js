/* Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Promise from 'bluebird';
import _ from 'lodash';

import sqldb from '../sqldb';
import config from './environment/';
import log from '../components/log';

export default function() {
  if (config.seedDB) {
    var jobDomainsData = [{
      'name': 'Sales &amp; Account Management',
      'id': 1
    }, {
      'name': 'Software Engineering',
      'id': 2
    }, {
      'name': 'Administrative',
      'id': 3
    }, {
      'name': 'Finance',
      'id': 4
    }, {
      'name': 'Hardware Engineering',
      'id': 5
    }, {
      'name': 'Technical Writing',
      'id': 6
    }, {
      'name': 'Technical Infrastructure',
      'id': 7
    }, {
      'name': 'Legal &amp; Government Relations',
      'id': 8
    }, {
      'name': 'Information Technology',
      'id': 9
    }];
    var JobDomainSeed = sqldb.JobDomain.bulkCreate(jobDomainsData);

    var jobTypesData = [{
      'name': 'Permanent',
      'id': 1
    }, {
      'name': 'Temporary',
      'id': 2
    }, {
      'name': 'Contract',
      'id': 3
    }, {
      'name': 'Intern',
      'id': 4
    }];
    var JobTypeSeed = sqldb.JobType.bulkCreate(jobTypesData);

    var ScopeSeed = sqldb.Scope.bulkCreate([{
      'id': 'users:read',
      'description': 'View users data.'
    }, {
      'id': 'users:write',
      'description': 'View and manage users data'
    }, {
      'id': 'roles:read',
      'description': 'View role data.'
    }, {
      'id': 'roles:write',
      'description': 'View and manage role data'
    }, {
      'id': 'scopes:read',
      'description': 'View scope data.'
    }, {
      'id': 'scopes:write',
      'description': 'View and manage scope data'
    }, {
      'id': 'jobs:write',
      'description': 'View and manage jobs data'
    }, {
      'id': 'education:read',
      'description': 'View education data'
    }, {
      'id': 'education:write',
      'description': 'View and manage education data'
    }, {
      'id': 'experiences:read',
      'description': 'View experience data'
    }, {
      'id': 'experiences:write',
      'description': 'View and manage experience data'
    }]);

    var RoleSeed = sqldb.Role.bulkCreate([{
      'name': 'Admin',
      'id': 1
    }, {
      'name': 'Manager',
      'id': 2
    }, {
      'name': 'User',
      'id': 3,
      'default': true
    }]);

    var userSeedData = [{
      'id': 3,
      'provider': 'local',
      'firstName': 'Oliver',
      'lastName': 'Grood',
      'email': 'oliver@oyejobs.com',
      'password': 'test',
      'gender': 'Male',
      'avatar': 'avatars:avatar-3',
      'birthDate': { date: '1988-02-13' },
      'role_id': 3
    }, {
      'id': 2,
      'provider': 'local',
      'firstName': 'Mary',
      'lastName': 'Jane',
      'email': 'mary@oyejobs.com',
      'password': 'test',
      'gender': 'Female',
      'birthDate': { date: '1992-05-25' },
      'avatar': 'avatars:avatar-14',
      'phone': '',
      'role_id': 2
    }, {
      'id': 1,
      'provider': 'local',
      'firstName': 'John',
      'lastName': 'Cena',
      'email': 'admin@oyejobs.com',
      'password': 'admin',
      'gender': 'Male',
      'birthDate': { date: '1988-07-13' },
      'avatar': 'avatars:avatar-1',
      'phone': '9872447410',
      'role_id': 1
    }];

    for (var i = 4; i < 17; i++) {
      let user = {
        'provider': 'local',
        'firstName': 'Ram',
        'lastName': 'Singh ' + i,
        'email': `ramsingh${i}@oyejobs.com`,
        'password': 'test',
        'gender': 'Male',
        'avatar': 'avatars:avatar-' + i, //_.random(1, 16),
        'birthDate': { date: '1988-02-13' },
        'role_id': 3
      }
      userSeedData.push(user);
    }
    var UserSeed = sqldb.User.bulkCreate(userSeedData);

    var countryList = [{
      'isoCode': 'IND',
      'isoCode2': 'IN',
      'name': 'India'
    }, {
      'isoCode': 'USA',
      'isoCode2': 'US',
      'name': 'United States'
    }, {
      'isoCode': 'GBR',
      'isoCode2': 'GB',
      'name': 'United Kingdom'
    }, {
      'isoCode': 'AUS',
      'isoCode2': 'AU',
      'name': 'Australia'
    }];
    var CountrySeed = sqldb.Country.bulkCreate(countryList);

    var locationList = [
      { 'id': 1, 'name': 'Chandigarh', 'country_isoCode': 'IND' },
      { 'id': 2, 'name': 'Bengaluru', 'country_isoCode': 'IND' },
      { 'id': 3, 'name': 'Gurgaon', 'country_isoCode': 'IND' },
      { 'id': 4, 'name': 'Hyderabad', 'country_isoCode': 'IND' },
      { 'id': 5, 'name': 'Pune', 'country_isoCode': 'IND' },
      { 'id': 6, 'name': 'California', 'country_isoCode': 'USA' },
      { 'id': 7, 'name': 'Florida', 'country_isoCode': 'USA' },
      { 'id': 8, 'name': 'London', 'country_isoCode': 'GBR' },
      { 'id': 9, 'name': 'Bracknell', 'country_isoCode': 'GBR' },
      { 'id': 10, 'name': 'North Sydney', 'country_isoCode': 'AUS' },
      { 'id': 11, 'name': 'Chatswood', 'country_isoCode': 'AUS' }
    ];

    var LocationSeed = sqldb.Location.bulkCreate(locationList);

    var jobDesc = `<h4 class="md-title">The Challenge</h4>
      <p>Designated as a Software Engineer, the profile is a mix and matches of development and testing where-in the development / code is focused to and would facilitate testing. People who fit this role are software developers at services based IT companies or white box testers at Software Product companies. The position reports into the Quality Manager.</p>
      <h4 class="md-title">The Opportunity:</h4>
      <p>Anticipate, procure and configure test setup, estimate the efforts involved for qualifying the changes, perform in-depth testing, including writing and executing test scripts and test specifications, prepare test strategy for the feature assigned.
      Developing or adapting testing tools for functional area is a must.
      The requirements:</p>
      <ul>
      <li>Hands on Java or C/C++ programming.</li>
      <li>Strong Windows / Linux OS fundamentals. Mac OS experience will be an added advantage.</li>
      <li>Exposure in writing full test frameworks would be a definite advantage</li>
      <li>Should have excellent bug writing skills often suggesting the technical solutions to the issues.</li>
      <li>Experience with automation tools would be awesome!</li.>
      <li>Should be capable of working independently and collaboratively with a team</li>
      <li>B.Tech - Computer Science with 2 - 4 years' experience in Desktop and Enterprise / Cloud products or applications</li>
      </ul>
     `;

    var jobNames = [
      'Senior Software Engineer',
      'Tech Lead',
      'Software Engineer',
      'Senior HR',
      'Project Manager',
      'Program Manager'
    ];

    var jobData = [];
    // create random jobs
    _(50).times(() => {
      var lid = locationList[_.random(0, locationList.length - 1)].id;
      var jobTypeId = jobTypesData[_.random(0, jobTypesData.length - 1)].id;
      jobData.push({
        'name': jobNames[_.random(0, jobNames.length - 1)],
        'description': jobDesc,
        'location_id': lid,
        'job_type_id': jobTypeId,
        'job_domain_id': 9,
        'author_id': 1
      });
    });

    return Promise.all([
        UserSeed,
        RoleSeed,
        ScopeSeed,
        CountrySeed,
        LocationSeed,
        JobTypeSeed,
        JobDomainSeed
      ])
      .then(() => {
        var RoleScopeSeed = sqldb.RoleScope.bulkCreate([{
          'role_id': 1,
          'scope_id': 'users:write'
        }, {
          'role_id': 1,
          'scope_id': 'users:read'
        }, {
          'role_id': 1,
          'scope_id': 'roles:write'
        }, {
          'role_id': 1,
          'scope_id': 'roles:read'
        }, {
          'role_id': 1,
          'scope_id': 'scopes:write'
        }, {
          'role_id': 1,
          'scope_id': 'jobs:write'
        }, {
          'role_id': 1,
          'scope_id': 'scopes:read'
        }, {
          'role_id': 2,
          'scope_id': 'users:read'
        }, {
          'role_id': 2,
          'scope_id': 'jobs:write'
        }, {
          'role_id': 3,
          'scope_id': 'users:read'
        }]);

        var JobSeed = sqldb.Job.bulkCreate(jobData);

        var EducationSeed = sqldb.Education.bulkCreate([{
          'schoolName': 'Guru Nanak Dev University',
          'studyName': 'Bachelor of Science IT',
          'startDate': { date: '2005-04' },
          'endDate': { date: '2008-04' },
          'user_id': '1'
        }, {
          'schoolName': 'Punjab School Education Board',
          'studyName': 'High School 10+2',
          'startDate': { date: '2003-04' },
          'endDate': { date: '2005-04' },
          'user_id': '1'
        }]);

        var ExperienceSeed = sqldb.Experience.bulkCreate([{
          'title': 'Sr. Software Engineer',
          'companyName': 'Tech Mahindra',
          'startDate': { date: '2014-08' },
          'currentCompany': true,
          'location_id': 1,
          'user_id': '1'
        }, {
          'title': 'Sr. Flash Programmer',
          'companyName': 'Nvish Solutions',
          'startDate': { date: '2011-02' },
          'endDate': { date: '2013-04' },
          'location_id': 1,
          'user_id': '1'
        }]);

        return Promise.all([
          RoleScopeSeed,
          JobSeed,
          EducationSeed,
          ExperienceSeed
        ]);
      })
      .then(() => {
        log('Database population finished.');
      });
  }
}
