let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const router = Router();

/*
* Pagina de inicio
*/
router.get('/clients', (req, res) => {

    administrativeService
        .getClients()
        .then((return_data) => {
            console.log(return_data)
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


exports.router = router;
