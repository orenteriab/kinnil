let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const router = Router();


router.get('/clients', (req, res) => {

    administrativeService
        .getClients()
        .then((return_data) => {
            res.render('pages/clients.ejs', { 
                message: '',
                clients: return_data
            });
        })
        .catch(function (error) {
            console.error('Error when querying: \n', error);
            res.status(500);
            res.send(JSON.stringify({ error: 'Unable to retrieve data from datbase.' }));
        });
});

router.get('/clients/:clientId', (req, res) => {

    administrativeService
        .getClientDetail(req.params.clientId)
        .then((return_data) => {
            res.render('pages/clientsdetail.ejs', { 
                message: '',
                client: return_data.client,
                locations: return_data.locations,
                facilities: return_data.facilities,
                products: return_data.products,
                sands: return_data.sands
            });
        })
        .catch(function (err) {
            console.error('[Web/administrative_controller.js][/clients/:clientId] Error cuando obtenemos el detalle de un cliente: ', err);
            res.status(500);
            res.send(JSON.stringify({ err: 'Unable to retrieve data from datbase.' }));
        });
});

router.get('/locations/:locationId', (req, res) => {

    administrativeService
        .getLocationGoals(req.params.locationId)
        .then((return_data) => {
            res.render('pages/locations.ejs', { 
                message: '',
                location: return_data.location,
                goals: return_data.goals
            });
        })
        .catch(function (err) {
            console.error('[Web/administrative_controller.js][/locations/:locationId] Error cuando obtenemos las metas de la locacion: ', err);
            res.status(500);
            res.send(JSON.stringify({ err: 'Unable to retrieve data from datbase.' }));
        });
});

router.get('/hr', (req, res) => {

    administrativeService
        .getHr()
        .then((return_data) => {
            res.render('pages/hr.ejs', { 
                message: '',
                hr: return_data
            });
        })
        .catch(function (err) {
            console.error('[Web/administrative_controller.js][/hr] Error cuando obtenemos el detalle de un hr: ', err);
            res.status(500);
            res.send(JSON.stringify({ err: 'Unable to retrieve data from datbase.' }));
        });
});

router.get('/drivers', (req, res) => {

    administrativeService
        .getDrivers()
        .then((return_data) => {
            res.render('pages/drivers.ejs', { 
                message: '',
                drivers: return_data.drivers,
                onlineOffile: return_data.onlineOffline
            });
        })
        .catch(function (err) {
            console.error('[Web/administrative_controller.js][/hr] Error cuando obtenemos el detalle de un hr: ', err);
            res.status(500);
            res.send(JSON.stringify({ err: 'Unable to retrieve data from datbase.' }));
        });
});

exports.router = router;