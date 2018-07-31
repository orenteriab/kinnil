const ROUTER = require('express').Router();
const SERVICE = require('../../service/reports_service');

ROUTER.post('/completed_loads', (req, res) => {
    SERVICE
        .getCompletedLoadsReport(req.body.inicio, req.body.fin)
        .then((returnData) => {
            res.status(201);
            res.json(returnData);
        })
        .catch((err) => {
            res.status(400);
            console.log(err)
            res.json({ message: `The report could not be created, please try again later.` });
        });
});

exports.router = ROUTER;