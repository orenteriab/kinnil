let Router = require('express').Router;
let administrativeService = require('../../service/administrative_service');

const router = Router();

router.get('/', (req, res) => {

    res.render('pages/goals.ejs', { 
        message: ''
    });
});

exports.router = router;