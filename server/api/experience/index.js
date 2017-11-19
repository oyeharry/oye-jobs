'use strict';

import { Router } from 'express';

import * as auth from '../../auth/auth.service';
import * as controller from './experience.controller';

var router = new Router();

router.get('/users/me', auth.isAuthenticated(), controller.getMe);
router.get('/users/:uid', auth.hasScope('experiences:read'), controller.get);

router.put('/:id/users/me', auth.isAuthenticated(), controller.updateMe);
router.put(
  '/:id/users/:uid',
  auth.hasScope('experiences:write'),
  controller.update
);

router.delete('/:id/users/me', auth.isAuthenticated(), controller.destroyMe);
router.delete(
  '/:id/users/:uid',
  auth.hasScope('experiences:write'),
  controller.destroy
);

router.post('/users/me', auth.isAuthenticated(), controller.createMe);
router.post(
  '/users/:uid',
  auth.hasScope('experiences:write'),
  controller.create
);

export default router;
