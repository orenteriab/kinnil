const ROUTER = require('express').Router();
const SERVICE = require('../../service/tickets_service');

ROUTER.post('/upload/csv', (req, res) => {
    SERVICE
        .create(req.body.record)
        .then(() => {
            res.status(201);
            res.json({ message: `${req.body.record['TMS Load #']} received!` });
        })
        .catch((err) => {
            res.status(400);
            console.log(err)
            res.json({ message: `${req.body.record['TMS Load #']} was impossible to store. Please verify its information is correct.` });
        });
});

exports.router = ROUTER;