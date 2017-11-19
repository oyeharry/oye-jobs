'use strict';

import { Education, User } from '../../sqldb';
import apiResponse from '../../components/api-response';

function createByUserId(userId, eduData, res) {
  return User.findOne({
    where: { id: userId }
  })
    .then(user => {
      if (!user) {
        res.status(422).json({
          message: 'User not found!'
        });
      }

      return Education.create(eduData).then(education => {
        return user.addEducation(education).then(() => education);
      });
    })
    .then(education => {
      res.status(200).json(education);
    });
}

function getByUserId(userId, res) {
  return Education.findAll({
    where: { 'user_id': userId }
  }).then(education => {
    res.status(200).json(education);
  });
}

function updateByUserId(userId, eduId, eduData, res) {
  return Education.findOne({
    where: { id: eduId }
  }).then(education => {
    if (!education) {
      res.status(422).end();
    } else {
      education.update(eduData).then(apiResponse(res, 201));
    }
  });
}

function destroyByUserId(userId, eduId, res) {
  return Education.findOne({
    where: { id: eduId }
  }).then(education => {
    if (!education) {
      res.status(422).end();
    } else {
      education.destroy().then(apiResponse(res, 201));
    }
  });
}

export function createMe(req, res, next) {
  createByUserId(req.user.id, req.body, res).catch(next);
}

export function create(req, res, next) {
  createByUserId(req.params.uid, req.body, res).catch(next);
}

export function getMe(req, res, next) {
  getByUserId(req.user.id, res).catch(next);
}

export function get(req, res, next) {
  getByUserId(req.params.uid, res).catch(next);
}

export function updateMe(req, res, next) {
  updateByUserId(req.user.id, req.params.id, req.body, res).catch(next);
}

export function update(req, res, next) {
  updateByUserId(req.params.uid, req.params.id, req.body, res).catch(next);
}

export function destroyMe(req, res, next) {
  destroyByUserId(req.user.id, req.params.id, res).catch(next);
}

export function destroy(req, res, next) {
  destroyByUserId(req.params.uid, req.params.id, res).catch(next);
}
