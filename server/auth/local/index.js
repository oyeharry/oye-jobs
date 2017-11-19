'use strict';

import express from 'express';
import passport from 'passport';

import { signToken } from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    var errMsg = { message: 'Something went wrong, please try again.' };
    if (error) {
      return res.status(401).json(error);
    }
    if (!user) {
      return res.status(404).json(errMsg);
    }

    user
      .getRole()
      .then(role => role.getScopes())
      .then(scopes => {
        var scopeIds = scopes.map(val => val.id);
        var token = signToken(user.id, scopeIds);
        res.json({ token });
      })
      .catch(() => {
        return res.status(404).json(errMsg);
      });
  })(req, res, next);
});

export default router;
