let Router = require('express').Router;
let dispatcherService = require('../../service/dispatcher_service');

const ROUTER = Router();

/*
* Endpoint -> driversUp, trucksUps and trailersUp
*/
ROUTER.get('/getUps', (req, res) => {

    dispatcherService
        .getThingsUp()
        .then((return_data) => {

            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: '', 
                                        driversUp: return_data.driversUp,
                                        trucksUp: return_data.trucksUp,
                                        trailersUp: return_data.trailersUp
                                    }));
        })
        .catch(function (err) {
            
            console.log('[Api/dispatcher_controller.js][/getUps] Error cuando obtenemos los drivers, trucks y trailers disponibles: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: error }));
        });
});

ROUTER.get('/getTicketDetail/:ticketId', (req, res) => {

    dispatcherService
        .getTicketDetail(req.params.ticketId)
        .then((return_data) => {

            console.log(return_data);

            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ 
                                    ticket: return_data
                                    }));
        })
        .catch(function (err) {
            
            console.log('[Api/dispatcher_controller.js][/getUps] Error cuando obtenemos los drivers, trucks y trailers disponibles: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: error }));
        });
});

exports.router = ROUTER;