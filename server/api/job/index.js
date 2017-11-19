'use strict';

import { Router } from 'express';
import * as controller from './job.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.get('/search', controller.searchJobs);
router.get('/length', controller.getJobsLength);
router.get('/:id', controller.getJob);
router.get('/:id/users', auth.hasScope('users:read'), controller.getJobUsers);
router.put('/:id', auth.hasScope('jobs:write'), controller.updateJob);
router.post('/', auth.hasScope('jobs:write'), controller.create);
router.delete('/:id', auth.hasScope('jobs:write'), controller.destroy);

export default router;
