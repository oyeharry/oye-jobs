'use strict';

import { Scope } from '../../sqldb';

export function index(req, res, next) {
  return Scope.findAll({
    attributes: ['id', 'description']
  })
    .then(scopes => {
      res.status(200).json(scopes);
    })
    .catch(next);
}
