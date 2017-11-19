'use strict';

import { JobType } from '../../sqldb';

export function index(req, res, next) {
  return JobType.findAll({
    attributes: ['id', 'name']
  })
    .then(jobTypes => {
      res.status(200).json(jobTypes);
    })
    .catch(next);
}
