import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {passportUserLogin, passportUserSignUp} from '../service/user_service';

const localStrategy = new Strategy({
  passwordField: 'password',
  usernameField: 'username',
  passReqToCallback: true
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((userId, done) => {
  userService
    .findUserById(userId)
    .then((rows) => done(null, rows[0]))
    .catch((err) => done(err));
});

passport.use('local-signup', localStrategy, passportUserSignUp);

passport.use('local-login', localStrategy, passportUserLogin);

exports.passport = passport;