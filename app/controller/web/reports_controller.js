let Router = require('express').Router;
let reprotsService = require('../../service/reports_service');

const router = Router();

router.get('/home', (req, res) => {

    res.render('pages/reports.ejs', { 
        message: ''
    });
});


exports.router = router;