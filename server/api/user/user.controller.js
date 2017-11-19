'use strict';

import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import config from '../../config/environment';
import path from 'path';
import multer from 'multer';
import Promise from 'bluebird';
Promise.promisifyAll(fs);

import {
  User,
  Role,
  Scope,
  Job,
  Location,
  Country,
  Education,
  Experience
} from '../../sqldb';
import apiResponse from '../../components/api-response';
import { signToken } from '../../auth/auth.service.js';

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, getImagesPath(req.app));
  },
  filename: function(req, file, cb) {
    let fileName =
      'profile-photo-' +
      req.user.id +
      '-temp-' +
      new Date().getTime() +
      path.extname(file.originalname);
    cb(null, fileName);
  }
});
var profilePicUpload = multer({
  storage,
  limits: { fileSize: 1024000 }
}).single('profile-photo');

function getImagesPath(app) {
  return path.normalize(path.join(app.get('appPath'), config.imagesPath));
}

function changePassword(res, id, oldPass, newPass) {
  return User.find({
    where: {
      id
    }
  }).then(user => {
    return user.authenticate(oldPass).then(matched => {
      if (matched) {
        return user
          .update({
            password: newPass
          })
          .then(() => {
            res.status(204).end();
          });
      } else {
        res.status(403).json({
          wrong: true
        });
      }
    });
  });
}

function getUserById(id) {
  return User.find({
    where: {
      id: id
    },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'gender',
      'avatar',
      'photo',
      'birthDate',
      'phone',
      'provider'
    ],
    include: [{
      model: Role,
      as: 'role',
      attributes: ['name', 'id'],
      include: [{
        model: Scope,
        attributes: ['id']
      }]
    }, {
      model: Job,
      attributes: ['id', 'name']
    }, {
      model: Education,
      attributes: [
        'id',
        'schoolName',
        'studyName',
        'startDate',
        'endDate',
        'description'
      ]
    }, {
      model: Experience,
      attributes: [
        'id',
        'title',
        'companyName',
        'currentCompany',
        'startDate',
        'endDate',
        'description'
      ],
      include: [{
        model: Location,
        as: 'location',
        attributes: ['name', 'id'],
        include: [{
          model: Country,
          as: 'country',
          attributes: ['name', 'isoCode', 'isoCode2']
        }]
      }]
    }]
  }).then(user => {
    // don't not include password or salt
    if (!user) {
      return user;
    }

    var userJson = user.toJSON();
    userJson.experiences = user.experiences.map(exp => {
      let expJson = exp.toJSON();
      expJson.location = {
        id: expJson.location.id,
        name: `${expJson.location.name}, ${expJson.location.country.name}`
      };
      return expJson;
    });

    if (userJson.role) {
      userJson.role.scopes = userJson.role.scopes.map(scope => scope.id);
    }
    return userJson;
  });
}

function sendEmailExistError(res) {
  res.status(422).json({
    message: 'This account already exist.',
    emailAlreadyExist: true
  });
}

function deleteOldPhoto(oldPhoto, res) {
  return new Promise(function(resolve) {
    if (oldPhoto) {
      let existImgFile = path.join(getImagesPath(res.app), oldPhoto);

      fs
        .accessAsync(existImgFile, fs.constants.R_OK | fs.constants.W_OK)
        .then(() => {
          return fs.unlinkAsync(existImgFile).then(resolve);
        })
        .catch(resolve);
    } else {
      resolve();
    }
  });
}

function deletePhotoById(id, res) {
  return User.find({ where: { id } }).then(user => {
    return deleteOldPhoto(user.photo, res)
      .then(() => {
        return user.update({ photo: null });
      })
      .then(apiResponse(res, 201));
  });
}

function updateUserPhotoById(id, file, res) {
  return User.find({ where: { id } }).then(user => {
    return deleteOldPhoto(user.photo, res).then(() => {
      let newName = file.filename.replace(/-temp/, '');
      let newFile = path.join(getImagesPath(res.app), newName);
      let oldFile = path.join(getImagesPath(res.app), file.filename);
      return fs
        .renameAsync(oldFile, newFile)
        .then(() => {
          return user.update({ photo: newName });
        })
        .then(() => {
          res.status(202).end();
        });
    });
  });
}

function getWhereClouse(query) {

  var whereClouse = {};
  // TODO: Add user serach queries
  if (query.search) {
    whereClouse.name = {
      $like: `%${query.search}%`
    };
  }
}

export function index(req, res, next) {
  var query = req.query;

  return User
    .findAll({
      offset: parseInt(query.from) || 0,
      limit: parseInt(query.size) || 10,
      where: getWhereClouse(query),
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'gender',
        'avatar',
        'birthDate',
        'photo',
        'provider'
      ],
      include: [{
        model: Role,
        as: 'role',
        attributes: ['name', 'id']
          /*,
                  include: [{
                    model: Scope, //when including this getting issue with sql query
                    attributes: ['id']
                  }]*/
      }]
    })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
}

export function getUsersLength(req, res, next) {

  User.count({ where: getWhereClouse(req.query) })
    .then(length => res.status(200).json({ length }))
    .catch(next);
}

// Get my info
export function getUser(req, res, next) {
  getUserById(req.params.id)
    .then(userJson => {
      if (!userJson) {
        res.status(401).end();
      }

      res.json(userJson);
    })
    .catch(next);
}

// Get my info
export function me(req, res, next) {
  getUserById(req.user.id)
    .then(userJson => {
      if (!userJson) {
        res.status(401).end();
      }

      res.json(userJson);
    })
    .catch(next);
}

// get my jobs
export function getJobs(req, res, next) {
  User.find({
      where: {
        id: req.user.id
      },
      include: [{
        model: Job,
        attributes: ['id', 'name', 'startDate'],
        include: [{
          model: Location,
          as: 'location',
          attributes: ['name', 'id'],
          include: [{
            model: Country,
            as: 'country',
            attributes: ['name', 'isoCode', 'isoCode2']
          }]
        }]
      }]
    })
    .then(user => {
      if (!user) {
        res.status(401).end();
      }

      let jobs = _(user.jobs).map(job => {
        let jobJson = job.toJSON();
        jobJson.applyDate = { date: jobJson['user_job']['created_at'] };
        jobJson.applyDate.humanize = moment
          .duration(moment(jobJson.applyDate.date) - new Date())
          .humanize(true);
        delete jobJson['user_jobs'];
        return jobJson;
      });
      res.json(jobs);
    })
    .catch(next);
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  User.find({
      where: {
        email: req.body.email
      }
    })
    .then(user => {
      if (user) {
        return sendEmailExistError(res);
      }

      return Role.findOne({ where: { default: true } }).then(role => {
        if (!role) {
          return next('Default role not found!');
        }

        var avatar;
        if (!req.body.avatar) {
          var gender = req.body.gender;
          avatar = 'avatars:avatar-';
          if (gender === 'Male') {
            avatar += _.random(1, 6);
          } else if (gender === 'Female') {
            avatar += _.random(7, 14);
          } else {
            avatar += '15';
          }
        }
        req.body.avatar = avatar;
        return User.create(req.body)
          .then(function(user) {
            user.setRole(role);
            var token = signToken(user.id, '');
            res.status(201).json({ token });
          })
          .catch(apiResponse(res, 422));
      });
    })
    .catch(next);
}

export function updateMe(req, res, next) {
  User.find({
      where: { id: { $ne: req.body.id }, email: req.body.email }
    })
    .then(userExist => {
      if (userExist) {
        return sendEmailExistError(res);
      }

      return User.find({
        where: { id: req.body.id }
      });
    })
    .then(user => user.update(req.body))
    .then(user => {
      if (!req.body.jobs) {
        return user;
      }

      return Job.findAll({
        where: {
          id: req.body.jobs.map(job => job.id)
        }
      }).then(jobs => user.setJobs(jobs));
    })
    .then(apiResponse(res, 201))
    .catch(next);
}

export function updateUser(req, res, next) {
  User.find({
      where: { id: req.body.id }
    })
    .then(user => user.update(req.body))
    .catch(next);
}

export function changeUserPassword(req, res, next) {
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  changePassword(res, req.params.id, oldPass, newPass).catch(next);
}

export function changeMyPassword(req, res, next) {
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  changePassword(res, req.user.id, oldPass, newPass).catch(next);
}

export function changeRole(req, res, next) {
  User.find({
      where: {
        id: req.params.id
      }
    })
    .then(user => {
      return user.setRole(req.body.roleId).then(apiResponse(res, 201));
    })
    .catch(next);
}

export function destroy(req, res, next) {
  User.find({
      where: {
        id: req.params.id
      }
    })
    .then(user => {
      return user.destroy().then(apiResponse(res, 201));
    })
    .catch(next);
}

export function savePhoto(req, res, next) {
  profilePicUpload(req, res, function(err) {
    if (err) {
      next(err);
    } else {
      updateUserPhotoById(req.user.id, req.file, res).then(next);
    }
  });
}

export function deletePhoto(req, res, next) {
  deletePhotoById(req.user.id, res).then(next);
}
