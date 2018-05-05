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

ROUTER.get('/getClockinById/:hrId', (req, res) => {
    payrollService
        .getClockinById(req.params.hrId)
        .then((return_data) => {
            res.status(200)
            //console.log(json(return_data))
            res.json(return_data);
        });
})

ROUTER.post('/createPayrollEntry/', (req, res) => {

    console.log(req.body)
    payrollService
        .createPayrollEntry(req.body.clockinList, req.body.id, req.body.dllsHr, req.body.wireTransfer)
        .then((return_data) => {
            res.status(200)
            // TODO: hacer alguna validacion de que si se inserto correctamente devolver el mensaje adecuado
            res.json("Payroll entry created");
        });
})

ROUTER.get('/getPayrollHrById/:hrId', (req, res) => {
    payrollService
        .getPayrollHrById(req.params.hrId)
        .then((return_data) => {
            res.status(200)
            //console.log(json(return_data))
            res.json(return_data);
        });
})

exports.router = ROUTER;