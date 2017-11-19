'use strict';

import { Router } from 'express';
import * as controller from './location.controller';

var router = new Router();

router.get('/search', controller.searchLocations);

export default router;
