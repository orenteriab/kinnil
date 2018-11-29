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

ROUTER.post('/quickbooks-import', (req, res) => {
    SERVICE
        .getQuickbooksReport(req.body.inicio, req.body.fin, req.body.locationName)
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

ROUTER.post('/diamonback-report', (req, res) => {
    SERVICE.getDiamonBackReport(req.body.inicio, req.body.fin)
            .then(values => {
                res.status(200)
                res.json(values)
            })
            .catch(err => {
                console.error(`[reports_controller][diamonback-report]: Error when generating report \n`, err.sql)
                res.status(500)
                res.json({message: "The report couldn't be created, please try again later."})
            })
})

exports.router = ROUTER;