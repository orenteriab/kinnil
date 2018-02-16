let passport = require('passport');
let Strategy = require('passport-local').Strategy;
let userService = require('../service/user_service');

const LOCAL_STRATEGY_PROPERTIES = {
    passwordField: 'password',
    usernameField: 'username',
    passReqToCallback: true
};
const LOCAL_SIGNUP_STRATEGY = new Strategy(LOCAL_STRATEGY_PROPERTIES, userService.passportUserSignUp);
const LOCAL_LOGIN_STRATEGY = new Strategy(LOCAL_STRATEGY_PROPERTIES, userService.passportUserLogin);

const STRATEGY_NAMES = {
    login: 'local-login',
    signup: 'local-signup'
};

const AUTHENTICATE_PROCESS = {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
};

function isLoggedIn(req, res, next){
    if(req !== undefined && req !== null && req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}

function loginCallback(request, response){
    if(request.body.remember){
        request.session.cookie.maxAge = 180000;
    }else{
        request.session.cookie.expires = false;
    }

    response.redirect('/');
}

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((userId, done) => {
    userService
        .findUserById(userId)
        .then((rows) => done(null, rows[0]))
        .catch((err) => done(err));
});

passport.use(STRATEGY_NAMES.signup, LOCAL_SIGNUP_STRATEGY);
passport.use(STRATEGY_NAMES.login, LOCAL_LOGIN_STRATEGY);

exports.passport = passport;
exports.isLoggedIn = isLoggedIn;
exports.loginAuthenticator = passport.authenticate(STRATEGY_NAMES.login, AUTHENTICATE_PROCESS, loginCallback);
exports.signUpAuthenticator = passport.authenticate(STRATEGY_NAMES.signup, AUTHENTICATE_PROCESS);