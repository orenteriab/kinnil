let Router = require('express').Router;
let payrollService = require('../../service/payroll_service');

const ROUTER = Router();

// Obtiene la lista de hr
ROUTER.post('/hr', (req, res) => {
    payrollService
        .getPayrollByPosition(req.body.position)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/hr] error when obtaining the hr list: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene la lista de drivers
ROUTER.post('/drivers', (req, res) => {
    payrollService
        .getPayrollByType(req.body.type)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/drivers] error when obtaining the drivers list: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene los detalles de un HR o de un driver (estan en la misma tabla)
ROUTER.post('/byId', (req, res) => {
    payrollService
        .getHrInformation(req.body.id)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/byId] error when obtaining the hr details for an HR or Driver: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene las entradas de clockin de ese HR
ROUTER.get('/getClockinById/:hrId', (req, res) => {
    payrollService
        .getClockinById(req.params.hrId)
        .then((return_data) => {
            res.status(200)
            //console.log(json(return_data))
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/getClockinById/:hrId] error when obtaining Obtiene las entradas de clockin de ese HR: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Crea una entrada en payroll_hr
ROUTER.post('/createPayrollEntry/', (req, res) => {
    payrollService
        .createPayrollEntry(req.body.clockinList, req.body.id, req.body.dllsHr, req.body.wireTransfer)
        .then((return_data) => {
            res.status(200)
            // TODO: hacer alguna validacion de que si se inserto correctamente devolver el mensaje adecuado
            res.json("Payroll entry created");
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/createPayrollEntry] error when obtaining Crea una entrada en payroll_hr: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Crea una entrada en payroll_drivers
ROUTER.post('/createPayrollEntryforDriver/', (req, res) => {
    payrollService
        .createPayrollEntryforDriver(req.body.ticketList, req.body.id, req.body.rate, req.body.type, req.body.wireTransfer)
        .then((return_data) => {
            res.status(200)
            // TODO: hacer alguna validacion de que si se inserto correctamente devolver el mensaje adecuado
            res.json("Payroll entry created");
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/createPayrollEntryforDriver] error when Crea una entrada en payroll_drivers: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene las entradas de pyroll por hr_id. TODO: hay que modificar este codigo para hacer la paginacion y la busqueda del jquery-bootgrid (se tiene que hacer en el back-end)
ROUTER.get('/getPayrollHrById/:hrId', (req, res) => {
    payrollService
        .getPayrollHrById(req.params.hrId)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/createPayrollEntryforDriver] error when Obtiene las entradas de pyroll por hr_id: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene lot tickets que a echo el driver
ROUTER.get('/getTicketsById/:hrId', (req, res) => {
    console.log(req.params.hrId)
    payrollService
        .getTicketsById(req.params.hrId)
        .then((return_data) => {
            res.status(200)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/getTicketsById/:hrId] Obtiene lot tickets que a echo el driver ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})


// PDF
// Obtiene la informacion necesaria para armar el PDF para HR
ROUTER.get('/getPDFInformationHr/:payrollId', (req, res) => {
    payrollService
        .getPdfIinformationHr(req.params.payrollId)
        .then((return_data) => {
            res.status(200)
            console.log(return_data)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/getClockinById/:hrId] error when obtaining the Payroll information for the PDF: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

// Obtiene la informacion necesaria para armar el PDF para Drivers
ROUTER.get('/getPDFInformationDrivers/:payrollId', (req, res) => {
    payrollService
        .getPdfIinformationDrivers(req.params.payrollId)
        .then((return_data) => {
            res.status(200)
            console.log(return_data)
            res.json(return_data);
        })
        .catch(function (err) {
            console.log('[Api/payroll_controller.js][/getClockinById/:hrId] error when obtaining the Payroll information for the PDF: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        })
})

exports.router = ROUTER;