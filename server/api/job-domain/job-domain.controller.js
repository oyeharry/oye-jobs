'use strict';

import { JobDomain } from '../../sqldb';

export function index(req, res, next) {
  return JobDomain.findAll({
    attributes: ['id', 'name']
  })
    .then(jobDomains => {
      res.status(200).json(jobDomains);
    })
    .catch(next);
}
