let Router = require('express').Router
const passport = require('../../config/passport_config')
const administrativeService = require('../../service/administrative_service');

const router = Router()

router.get('/', (req, res) => {
    res.render('pages/login_customer.ejs', { message: '' })
})

router.post('/sing-in', passport.customerLoginAuthenticator, (req, res) => {
    req.session.save((err) => {
        if(err){
            res.render('pages/login.ejs', { message: JSON.stringify(err) })
        }

        res.redirect('/customer/goals')
    })

})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if(err){
            return next(err)
        }

        res.redirect('/customer/')
    });
});

router.get('/goals', passport.isLoggedInAsCustomer , (req, res) => {
    administrativeService
        .getClientDetail(1) // There is only one client at the moment
        .then((clientDetails) => {
            res.render('pages/goals.ejs', { message: '', crews: clientDetails.crews })
        }, (err) => {
            res.render('pages/goals.ejs', { message: 'Unable to retrieve locations, try again.', locations: [] })
        })
    
})

exports.router = router