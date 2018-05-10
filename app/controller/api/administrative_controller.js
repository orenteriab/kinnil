let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const ROUTER = Router();


ROUTER.put('/clients/delete/:clientId', (req, res) => {

    administrativeService
        .deleteClient(req.params.clientId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'Client has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/clients/delete/'+ req.params.clientId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.post('/addsand/', (req, res) => {

    administrativeService
        .addSand(req.body.name, 1) // 1 El cliente es halliburton por default
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'sand has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addsand/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.put('/deletesand/', (req, res) => {

    administrativeService
        .deleteSand(req.body.sandId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'sand has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/deletesand/'+ req.body.sandId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});


ROUTER.post('/addproduct/', (req, res) => {

    administrativeService
        .addProduct(req.body.name, 1)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'product has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addproduct/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.put('/deleteproduct/', (req, res) => {

    administrativeService
        .deleteProduct(req.body.productId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'product has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/deleteproduct/'+ req.body.productId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.post('/addfacilitie/', (req, res) => {

    administrativeService
        .addFacilitie(req.body.name, 1)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'facilitie has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addfacilitie/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.put('/deletefacility/', (req, res) => {

    administrativeService
        .deleteFacility(req.body.facilityId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'facility has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/deletefacility/'+ req.body.facilityId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.post('/addlocation/', (req, res) => {

    administrativeService
        .addLocation(req.body.name, 'ON GOING', req.body.geolocation ,req.body.startDate, req.body.endDate, 1)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'location has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addlocation/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.put('/deletelocation/', (req, res) => {

    administrativeService
        .deleteLocation(req.body.locationId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'location has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/deletelocation/'+ req.body.locationId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.post('/addhr/', (req, res) => {

    administrativeService
        .addHr(req.body.name,
            req.body.address,
            req.body.tel,
            req.body.civilStatus,
            req.body.email,
            req.body.contact1,
            req.body.contact2,
            req.body.birth,
            req.body.laborStatus,
            req.body.position,
            req.body.dllsHr,
            req.body.mcExp,
            req.body.ssn,
            req.body.username,
            req.body.password,
            req.body.shift,
            req.body.crew,
            1) // 1 el default siempre es 1 porque en esta version solo hay un cliente (HALLIBURTON)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'employee has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addemployee/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.post('/adddriver/', (req, res) => {

    administrativeService
        .addDriver(
            req.body.name,
            req.body.address,
            req.body.tel,
            req.body.civilStatus,
            req.body.email,
            req.body.contact1,
            req.body.contact2,
            req.body.birth,
            req.body.laborStatus,
            req.body.position,
            req.body.rate,
            req.body.mcExp,
            req.body.ssn,
            req.body.type,
            req.body.crew,
            req.body.shift,
            req.body.user,
            req.body.password,
            req.body.license,
            req.body.licenseExp,
            req.body.state,
            req.body.hireDate,
            req.body.licenseClass,
            req.body.experience,
            req.body.paymentMethod,
            req.body.BankAccount,
            req.body.RoutingNumber,
            1) // 1 el default siempre es 1 porque en esta version solo hay un cliente (HALLIBURTON)
        .then((return_data) => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'driver has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/adddriver/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

// Es para ver el detalle del HR o del Driver
ROUTER.get('/getHrDetail/:HrId', (req, res) => {

    administrativeService
        .getHrDetail(req.params.HrId)
        .then((return_data) => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ 
                    message: '',
                    hr: return_data
                })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/clients/delete/'+ req.params.clientId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

// Aunque tenga que ser un PUT x-editable necesita que sea un POST
// Sirve para HRs y Drivers
ROUTER.post('/updatehr/', (req, res) => {

    console.log(req.body)
    administrativeService
        .updateHr(req.body.name, req.body.value, req.body.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/cancelTicket/' + req.body.ticketId + ']Error when updating ticket: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

// Aunque tenga que ser un PUT x-editable necesita que sea un POST
ROUTER.post('/updateticket/', (req, res) => {
    administrativeService
        .updateTicket(req.body.name, req.body.value, req.body.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/cancelTicket/' + req.body.ticketId + ']Error when updating ticket: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

ROUTER.get('/getClockinById/:pk', (req, res) => {
    console.log(req.params.pk)
    administrativeService
        .getClockinById(req.params.pk)
        .then((return_data) => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify(return_data));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/getClockinById/' + req.params.pk + ']Error when obtain clockin by id: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

ROUTER.put('/updateClockinById/:pk', (req, res) => {
    console.log(req.params.pk)
    administrativeService
        .updateClockinById(req.body.in, req.body.out, req.params.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/updateClockinById/' + req.params.pk + ']Error when obtain clockin by id: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

exports.router = ROUTER;


