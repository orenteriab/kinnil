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
            res.send(
                JSON.stringify({ 
                    message: '', 
                    driversUp: return_data.driversUp,
                    trucksUp: return_data.trucksUp,
                    trailersUp: return_data.trailersUp
                })
            );
        })
        .catch(function (err) {
            
            console.log('[Api/dispatcher_controller.js][/getUps] Error cuando obtenemos los drivers, trucks y trailers disponibles: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

/*
* Obtiene el detalle del ticket por Id
*/
ROUTER.get('/getTicketDetail/:ticketId', (req, res) => {

    dispatcherService
        .getTicketDetail(req.params.ticketId)
        .then((return_data) => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ ticket: return_data }));
        })
        .catch(function (err) {
            
            console.log('[Api/dispatcher_controller.js][/getTicketDetail/:ticketId] Error cuando obtenemos el detalle de un ticket: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});

/*
* Obtiene los eventos del ticket por Id del ticket
*/
ROUTER.get('/getEventsDetail/:ticketId', (req, res) => {

    dispatcherService
        .getEvents(req.params.ticketId)
        .then((return_data) => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ events: return_data }));
        })
        .catch(function (err) {
            
            console.log('[Api/dispatcher_controller.js][/getUps] Error cuando obtenemos los eventos de un ticket: ', err);
            res.status(404);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: err }));
        });
});


/*
* Assign Ticket
*/
ROUTER.put('/assignTicket/', (req, res) => {

    dispatcherService
        .assignTicket(req.body.hrId, req.body.product, req.body.ticketId)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket has been assigned successfully.' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/assignTicket/' + req.body.ticketId + ']Error when updating ticket: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket couldn\'t be assigned. Please retry.' }));
        });
});

/*
* Cancel ticket
*/
ROUTER.put('/cancelTicket/', (req, res) => {

    dispatcherService
        .cancelTicket(req.body.ticketId)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket has been cancelled successfully.' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/cancelTicket/' + req.body.ticketId + ']Error when updating ticket: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket couldn\'t be cancelled. Please retry.' }));
        });
});

/*
* Complete ticket
*/
ROUTER.put('/completeTicket/', (req, res) => {

    dispatcherService
        .completeTicket(req.body.ticketId)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket(s) has been completed successfully.' }));
        })
        .catch((err) => {
            console.error('[Api/dispatcher_controller.js][/completeTicket/' + req.body.ticketId + ']Error when updating ticket(s): ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Ticket(s) couldn\'t be completed. Please retry.' }));
        });
});

exports.router = ROUTER;