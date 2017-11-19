'use strict';

import { Router } from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();
router.get('/', auth.hasScope('users:read'), controller.index);
router.get('/length', controller.getUsersLength);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/me/jobs', auth.isAuthenticated(), controller.getJobs);
router.get('/:id', auth.isAuthenticated(), controller.getUser);
router.put('/me', auth.isAuthenticated(), controller.updateMe);
router.put('/:id', auth.hasScope('users:write'), controller.updateUser);
router.put('/me/password', auth.isAuthenticated(), controller.changeMyPassword);
router.put(
  '/:id/password',
  auth.hasScope('users:write'),
  controller.changeUserPassword
);
router.delete('/:id', auth.hasScope('users:write'), controller.destroy);
router.put('/:id/role', auth.hasScope('users:write'), controller.changeRole);
router.post('/me/photo', auth.isAuthenticated(), controller.savePhoto);
router.delete('/me/photo', auth.isAuthenticated(), controller.deletePhoto);
router.post('/', controller.create);

export default router;
