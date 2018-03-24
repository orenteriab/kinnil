let Router = require('express').Router;
let dispatcherService = require('../../service/dispatcher_service');

const router = Router();

/*
* Pagina de inicio
*/
router.get('/home', (req, res) => {

    dispatcherService
        .getTicketsInfo()
        .then((return_data) => {
            res.render('pages/inicio.ejs', { 
                message: '',
                tickets: return_data
            });
        })
        .catch(function (error) {
            console.error('Error when querying: \n', error);
            res.status(500);
            res.send(JSON.stringify({ error: 'Unable to retrieve data from datbase.' }));
        });
});

/*
/ Dispatcher
*/
router.get('/tobeassigned', (req, res) => {
    dispatcherService
        .getToBeAsignedInfo()
        .then((return_data) => {
            res.render('pages/tobeassigned.ejs', { 
                message: '',
                tickets: return_data.tickets,
                drivers: return_data.drivers,
                products : return_data.products
            });
        })
        .catch(function (error) {
            console.error('something went wrong!!!', error);
        });
});

router.get('/workinprogress', (req, res) => {
    dispatcherService
        .getTicketsInfo()
        .then((return_data) => {
            res.render('pages/workinprogress.ejs', { 
                message: '',
                tickets: return_data
            });
        })
        .catch(function (error) {
            console.error('something went wrong!!! ', error);
        });
});

router.get('/completed', (req, res) => {
    dispatcherService
        .getTicketsInfo()
        .then((return_data) => {
            res.render('pages/completed.ejs', { 
                message: '',
                tickets: return_data
            });
        })
        .catch(function (error) {
            console.error('something went wrong!!! ', error);
        });
});

exports.router = router;