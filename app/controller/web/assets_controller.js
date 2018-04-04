let Router = require('express').Router
let router = Router();
let assetsService = require('../../service/assets_service');

router.get('/', (req, res) => {
    assetsService.pullPageAsset().then((value) => {
        res.render('pages/assets.ejs', { message: '', assets: value })
    }, (error) => {
        console.error(error);
        res.sendStatus(500);
    });
});

exports.router = router;