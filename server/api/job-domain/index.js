'use strict';

import { Router } from 'express';

import * as controller from './job-domain.controller';

var router = new Router();

router.get('/', controller.index);

export default router;
