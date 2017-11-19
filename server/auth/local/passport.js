import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, email, password, done) {
  User.find({
    where: {
      email: email.toLowerCase()
    }
  })
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.',
          wrongEmail: true
        });
      }

      user
        .authenticate(password)
        .then(authenticated => {
          if (!authenticated) {
            return done(null, false, {
              message: 'This password is not correct.',
              wrongPassword: true
            });
          } else {
            return done(null, user);
          }
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
}

export function setup(User) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
      },
      function(email, password, done) {
        return localAuthenticate(User, email, password, done);
      }
    )
  );
}
