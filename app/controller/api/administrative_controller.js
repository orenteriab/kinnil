let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const ROUTER = Router();

/*
* 
*/
ROUTER.get('/clients/delete/:clientId', (req, res) => {

    administrativeService
        .deleteClients(req.params.clientId)
        .then(() => {

            res.status(200);
            res.contentType('application/json');
            res.send(
                JSON.stringify({ message: 'client has been deleted successfully.' })
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
        .addSand(req.body.name, 1)
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

ROUTER.post('/addhr/', (req, res) => {

    console.log('administrative add HR');
    administrativeService
        .addHr(req.body.name,
            req.body.address,
            req.body.tel,
            req.body.civilStatus,
            req.body.dependent,
            req.body.email,
            req.body.contact1,
            req.body.contact2,
            req.body.birth,
            req.body.over25,
            req.body.laborStatus,
            req.body.position,
            req.body.dllsHr,
            req.body.medicalCard,
            req.body.mcExp,
            req.body.drugTest,
            req.body.dtExp,
            req.body.ssn,
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
exports.router = ROUTER;