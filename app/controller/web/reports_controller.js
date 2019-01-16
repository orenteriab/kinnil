let Router = require('express').Router;
let reprotsService = require('../../service/reports_service');
let verifyRole = require('../../roles/app_roles').verifyRole

const router = Router();

router.get('/home', verifyRole(['INVOICE ASSISTANT', 'INVOICE MANAGER', 'PAYROLL ASSISTANT HR']), (req, res) => {

    res.render('pages/reports.ejs', { 
        message: ''
    });
});

router.get('/search', verifyRole(['INVOICE ASSISTANT', 'INVOICE MANAGER', 'PAYROLL ASSISTANT HR', 'PAYROLL ASSISTANT DRIVERS']), (req, res) => {

    res.render('pages/search.ejs', { 
        message: ''
    });
});

exports.router = router;