'use strict';

import { Router } from 'express';

import * as auth from '../../auth/auth.service';
import * as controller from './role.controller';

var router = new Router();

router.get('/', auth.hasScope('roles:read'), controller.index);
router.put('/:id', controller.updateRole);
router.delete('/:id', auth.hasScope('roles:write'), controller.destroy);
router.post('/', controller.create);

export default router;
