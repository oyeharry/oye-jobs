'use strict';

import express from 'express';

import { User } from '../sqldb';
import local from './local';

// passport configuration
require('./local/passport').setup(User);

var router = express.Router();

router.use('/local', local);

export default router;
