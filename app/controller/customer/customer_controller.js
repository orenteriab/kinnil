let Router = require('express').Router
const passport = require('../../config/passport_config')

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
    res.render('pages/goals.ejs', { message: '' })
})

exports.router = router