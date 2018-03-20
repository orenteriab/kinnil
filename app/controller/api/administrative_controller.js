let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const ROUTER = Router();

/*
* 
*/
ROUTER.get('/clients/delete/:clientId', (req, res) => {

    administrativeService
        .deleteClients(req.params.clientId)
        .then((return_data) => {

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

exports.router = ROUTER;