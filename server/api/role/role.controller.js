'use strict';

import Sequelize from 'sequelize';

import { Role, Scope } from '../../sqldb';
import apiResponse from '../../components/api-response';

export function index(req, res, next) {
  return Role.findAll({
    attributes: ['id', 'name'],
    include: [
      {
        model: Scope,
        attributes: ['id', 'description']
      }
    ]
  })
    .then(roles => {
      res.status(200).json(roles);
    })
    .catch(next);
}

export function updateRole(req, res, next) {
  Role.find({
    where: {
      id: req.params.id
    }
  })
    .then(role => {
      return role
        .update({
          name: req.body.name
        })
        .then(() => {
          req.body.scopes = req.body.scopes || [];
          return Scope.findAll({
            where: {
              id: req.body.scopes.map(scope => scope.id)
            }
          }).then(scopes => {
            return role.setScopes(scopes).then(() => {
              var roleJson = role.toJSON();
              roleJson.scopes = scopes;
              res.status(200).json(roleJson);
            });
          });
        })
        .catch(Sequelize.ValidationError, err => {
          res.status(422).json({
            roleAlreadyExist: true,
            message: err.errors[0].message
          });
        });
    })
    .catch(next);
}

/**
 * Creates a new user
 */
export function create(req, res, next) {
  req.body.scopes = req.body.scopes || [];
  return Role.create({ name: req.body.name })
    .then(function(role) {
      return Scope.findAll({
        where: {
          id: req.body.scopes.map(scope => scope.id)
        }
      }).then(scopes => {
        return role.setScopes(scopes).then(() => {
          var r = role.toJSON();
          r.scopes = scopes;
          res.status(200).json(r);
        });
      });
    })
    .catch(Sequelize.ValidationError, err => {
      res.status(422).json({
        roleAlreadyExist: true,
        message: err.errors[0].message
      });
    })
    .catch(next);
}

export function destroy(req, res, next) {
  Role.find({
    where: {
      id: req.params.id
    }
  })
    .then(role => {
      return role.destroy().then(apiResponse(res, 201));
    })
    .catch(next);
}
