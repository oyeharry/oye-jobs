'use strict';

import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import { User } from '../sqldb';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return (
    compose()
      // Validate jwt
      .use(function(req, res, next) {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`;
        }
        // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
        if (req.query && typeof req.headers.authorization === 'undefined') {
          req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(function(req, res, next) {
        User.find({
          where: {
            id: req.user.id
          }
        })
          .then(user => {
            if (!user) {
              return res.status(401).end();
            }

            req.user = user;
            next();
          })
          .catch(err => next(err));
      })
  );
}

/**
 * Checks if the user scope meets the requirements of the route
 */
export function hasScope(scopeRequired) {
  if (!scopeRequired) {
    throw new Error('Required scope needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      req.user.getRole().then(role => role.getScopes()).then(scopes => {
        var scopeList = scopes.map(scope => scope.id);
        if (scopeList.indexOf(scopeRequired) !== -1) {
          return next();
        } else {
          return res.status(403).send('Forbidden');
        }
      });
    });
}

/**
 * Sign token
 * @param  {String} id   Id of user
 * @param  {String} scopes scopes of user
 * @return {String}      Return the jwt token
 */
export function signToken(id, scopes) {
  return jwt.sign(
    {
      id: id,
      scopes
    },
    config.secrets.session,
    {
      expiresIn: '5h' // hours
    }
  );
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res
      .status(404)
      .send("It looks like you aren't logged in, please try again.");
  }
  var token = signToken(req.user.id, req.user.scopes);
  res.cookie('token', token);
  res.redirect('/');
}
