let Router = require('express').Router;
let payrollService = require('../../service/payroll_service');

const router = Router();

router.get('/hr', (req, res) => {

    res.render('pages/payroll-hr.ejs', { 
        message: ''
    });
});

router.get('/drivers', (req, res) => {

    res.render('pages/payroll-drivers.ejs', { 
        message: ''
    });
});


exports.router = router;