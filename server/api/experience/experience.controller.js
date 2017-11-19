'use strict';

import { Experience, Location, Country, User } from '../../sqldb';
import apiResponse from '../../components/api-response';

function createByUserId(userId, expData, res) {
  return User.findOne({
    where: { id: userId }
  })
    .then(user => {
      if (!user) {
        res.status(422).json({
          message: 'User not found!'
        });
      }

      return Experience.create(expData)
        .then(experience => experience.setLocation(expData.location.id))
        .then(experience => {
          return user.addExperience(experience).then(() => experience);
        });
    })
    .then(experience => {
      res.status(200).json(experience);
    });
}

function getByUserId(userId, res) {
  return Experience.findAll({
    where: { 'user_id': userId },
    include: [
      {
        model: Location,
        as: 'location',
        attributes: ['name', 'id'],
        include: [
          {
            model: Country,
            as: 'country',
            attributes: ['name', 'isoCode', 'isoCode2']
          }
        ]
      }
    ]
  }).then(experiences => {
    experiences = experiences.map(exp => {
      exp = exp.toJSON();
      exp.location = {
        id: exp.location.id,
        name: `${exp.location.name}, ${exp.location.country.name}`
      };
      return exp;
    });

    res.status(200).json(experiences);
  });
}

function updateByUserId(userId, expId, expData, res) {
  return Experience.findOne({
    where: { id: expId }
  }).then(experience => {
    if (!experience) {
      res.status(422).end();
    } else {
      experience
        .update(expData)
        .then(experience => experience.setLocation(expData.location.id))
        .then(apiResponse(res, 201));
    }
  });
}

function destroyByUserId(userId, expId, res) {
  return Experience.findOne({
    where: { id: expId }
  }).then(experience => {
    if (!experience) {
      res.status(422).end();
    } else {
      experience.destroy().then(apiResponse(res, 201));
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
