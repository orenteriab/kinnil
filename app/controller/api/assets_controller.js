let Router = require('express').Router
let assetsService = require('../../service/assets_service');
let router = Router();

router.post('/create', (req, res) => {
    assetsService
        .create(req.body.name, req.body.type, req.body.plate, req.body.status, req.body.mi, req.body.miLastService, req.body.mttoLast, req.body.mttoNext, req.body.notes, 1)
        .then(() => {
            res.status(201)
            res.json({ message: 'Asset created succesfully!'})
        })
        .catch((err) => {
            console.error(err)
            res.status(500)
            res.json({ error: 'Error when adding new asset, please try again.' })
        })
})

exports.router = router;