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
        .addSand(req.body.name, req.body.clientId) // 1 El cliente es halliburton por default
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

ROUTER.post('/addcrew/', (req, res) => {

    administrativeService
        .addCrew(req.body.name, req.body.clientId) // 1 El cliente es halliburton por default
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'crew has been added successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/addcrew/'+ req.body.name +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

ROUTER.put('/deletecrew/', (req, res) => {

    administrativeService
        .deleteCrew(req.body.crewId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'crew has been deleted successfully.' })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/administrative_controller.js][/deletecrew/'+ req.body.sandId +'] Error: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});



ROUTER.post('/addproduct/', (req, res) => {

    administrativeService
        .addProduct(req.body.name, req.body.clientId)
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
        .addFacilitie(req.body.name, req.body.clientId)
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
        .addLocation(req.body.name, 'ON GOING', req.body.geolocation ,req.body.startDate, req.body.endDate, req.body.clientId)
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

ROUTER.get('/location/:locationId/scales-data', (req, res) => {
    administrativeService
        .fetchScalesData(req.params.locationId)
        .then(
            (scalesData) => {
                res.status(200)
                res.json(scalesData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/location/'+ req.params.locationId + '/scales-data' + ']Error when obtain scales data by id: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch scales location for location id: ' + req.params.locationId + '.' })
            }
        )
})

ROUTER.get('/location/:locationId/goals-data', (req, res) => {
    administrativeService
        .fetchGoalsData(req.params.locationId)
        .then(
            (goalsData) => {
                res.status(200)
                res.json(goalsData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/location/'+ req.params.locationId + '/goals-data' + ']Error when obtain goals data by id: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch scales location for location id: ' + req.params.locationId + '.' })
            })
})

ROUTER.get('/location/:locationName/to-this-day', (req, res) => {

    console.log(req.params.locationName)
    administrativeService
        .fetchToThisDayData(req.params.locationName)
        .then(
            (goalsData) => {
                res.status(200)
                res.json(goalsData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/location/'+ req.params.locationName + '/to-this-day' + ']Error when obtain to this day data: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch to this day data info for location name: ' + req.params.locationName + '.' })
            })
})

ROUTER.get('/getLocationDetail/:locationId', (req, res) => {
    administrativeService
        .getLocationDetail(req.params.locationId)
        .then(
            (returnData) => {
                res.status(200)
                res.json(returnData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/getLocationDetail/'+ req.params.locationId + ']Error when obtain location data by id: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch location data by id: ' + req.params.locationId + '.' })
            })
})

ROUTER.get('/getFacilityDetail/:facilityId', (req, res) => {
    administrativeService
        .getFacilityDetail(req.params.facilityId)
        .then(
            (returnData) => {
                res.status(200)
                res.json(returnData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/getFacilityDetail/'+ req.params.facilityId + ']Error when obtain Facility data by id: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch Facility data by id: ' + req.params.facilityId + '.' })
            })
})

ROUTER.post('/updateLocation/', (req, res) => {

    administrativeService
        .updateLocation(req.body.name, req.body.value, req.body.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/updateLocation/]Error when updating location: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

ROUTER.post('/updateFacility/', (req, res) => {

    administrativeService
        .updateFacility(req.body.name, req.body.value, req.body.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/updateFacility/]Error when updating Facility: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

ROUTER.get('/getLocationsByCrewId/:crewId', (req, res) => {
    administrativeService
        .getLocationsByCrewId(req.params.crewId)
        .then(
            (returnData) => {
                res.status(200)
                res.json(returnData)
            },
            (err) => {
                console.error('[Api/administrative_controller.js][/getLocationsByCrewId/'+ req.params.crewId + ']Error when obtain location data by id: ', err);

                res.status(500)
                res.json({ status: 'error', msg: 'Unable to fetch location data by id: ' + req.params.locationId + '.' })
            })
})

ROUTER.post('/updateSandName/', (req, res) => {
    administrativeService
        .updateSandName(req.body.name, req.body.value, req.body.pk)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({status: 'success', msg: 'Record Updated' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/updateSandName/' + req.body.pk + ']Error when updating sand name: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ status: 'error', msg: 'field cannot be empty!' }));
        });
});

exports.router = ROUTER;


