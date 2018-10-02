const ROUTER = require('express').Router();
const SERVICE = require('../../service/tickets_service');

ROUTER.post('/upload/csv', (req, res) => {
    SERVICE
        .create(req.body.record)
        .then((returnedMessage) => {
           
            if (returnedMessage.insertId > 0){
                res.status(201)
                res.json(` ${req.body.record['TMS Load #']} Load Number Inserted!`)
            } else if (returnedMessage.changedRows > 0){
                res.status(201)
                res.json(` ${req.body.record['TMS Load #']} Load Number Updated!`)
            } else {
                res.status(201)
                res.json(`${req.body.record['TMS Load #']} Load Number Processed!`)
            }
        })
        .catch((err) => {
            res.status(400)
            console.log(err)
            res.json(`${req.body.record['TMS Load #']} ` + err)
        });
});

exports.router = ROUTER;