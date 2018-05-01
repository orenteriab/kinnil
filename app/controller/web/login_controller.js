const Router = require('express').Router;
const router = Router();
const passport = require('../../config/passport_config');

router.get('/', (req, res) => {
    if(req.isAuthenticated && req.isAuthenticated()){
        res.redirect('/web/dispatcher/home')
    }

    let reqFlash = {};
    
    if(req.flash){
        reqFlash = req.flash();
    }

    res.render('pages/login.ejs', { message: reqFlash.message || '' });
});

router.post('/', passport.loginAuthenticator, (req, res) => {
    req.session.save((err) => {
        if(err){
            res.render('pages/login.ejs', { message: JSON.stringify(err) });
        }

        res.redirect('/web/dispatcher/inicio');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if(err){
            return next(err);
        }

        res.redirect('/web/login');
    });
});

router.get('/signup', (req, res) => res.render('pages/signup.ejs', { message: '' }));

router.post('/signup', passport.signUpAuthenticator);

module.exports.router = router;