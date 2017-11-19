'use strict';

import { Router } from 'express';

import * as auth from '../../auth/auth.service';
import * as controller from './scope.controller';

var router = new Router();

router.get('/', auth.hasScope('scopes:read'), controller.index);

export default router;
