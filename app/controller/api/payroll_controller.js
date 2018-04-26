let Router = require('express').Router;
let payrollService = require('../../service/payroll_service');

const ROUTER = Router();

ROUTER.post('/hr', (req, res) => {
    payrollService
        .getPayrollByPosition(req.body.position)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        });
})

ROUTER.post('/drivers', (req, res) => {
    payrollService
        .getPayrollByType(req.body.type)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        });
})

ROUTER.post('/byId', (req, res) => {
    payrollService
        .getPayrollById(req.body.id)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        });
})


exports.router = ROUTER;