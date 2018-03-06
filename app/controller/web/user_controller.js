let Router = require('express').Router;
//let dispatcherService = require('../../service/dispatcher_service');

const router = Router();

// Agregado para poder utilizar modelos en las vistas
//let userModel = require('../../model/user_model.js')

router.get('/signup', (req, res) => {
    res.render('pages/signup.ejs', { message: ''});
});

router.get('/login', (req, res) => {
    res.render('pages/login.ejs', { message: ''});
});


/*
/ HR
*/
router.get('/clients', (req, res) => {
    res.render('pages/clients.ejs', { message: ''});
});

router.get('/drivers', (req, res) => {
    res.render('pages/drivers.ejs', { message: ''});
});

router.get('/hr', (req, res) => {
    res.render('pages/hr.ejs', { message: ''});
});

router.get('/clockin', (req, res) => {
    res.render('pages/clockin.ejs', { message: ''});
});

/*
/ Assets
*/
router.get('/trucks', (req, res) => {
    res.render('pages/trucks.ejs', { message: ''});
});

router.get('/trailers', (req, res) => {
    res.render('pages/trailers.ejs', { message: ''});
});

router.get('/equipment', (req, res) => {
    res.render('pages/equipment.ejs', { message: ''});
});

/*
/ Payroll
*/
router.get('/payroll', (req, res) => {
    res.render('pages/payroll.ejs', { message: ''});
});

/*
/ Invoice
*/
router.get('/invoice', (req, res) => {
    res.render('pages/invoice.ejs', { message: ''});
});

/*
* Mtto
*/
router.get('/mtto', (req, res) => {
    res.render('pages/mtto.ejs', { message: ''});
});

exports.router = router;