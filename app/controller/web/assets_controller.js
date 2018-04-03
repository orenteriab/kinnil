let Router = require('express').Router
let router = Router();

router.get('/', (req, res) => {
    res.render('pages/assets.ejs', { message: '', tickets: {}, drivers: {}, products: {} })
});

exports.router = router;