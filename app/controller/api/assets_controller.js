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

router.get('/:id', (req, res) => {
    assetsService
        .findById(req.params.id)
        .then((asset) => {
            res.status(200)
            res.json(asset);
        });
})

router.delete('/:id', (req, res) => {
    assetsService
        .deleteAsset(req.params.id)
        .then(() => {
            res.sendStatus(202);
        });
})

router.put('/update/:id', (req, res) => {
    assetsService
        .update(req.param('id'), req.body.name, req.body.type, req.body.plate, req.body.status, req.body.mi, req.body.miLastService, req.body.mttoLast, req.body.mttoNext, req.body.notes, 1, req.body.up)
        .then(() => {
            res.status(200)
            res.json({ message: 'Asset '+ req.param('id') +' updated succesfully!'})
        })
        .catch((err) => {
            console.error(err)
            res.status(500)
            res.json({ error: 'Error when updating asset ' + req.param('id') + ', please try again.' })
        })
})

exports.router = router;