let Router = require('express').Router;

const router = Router();

router.get('/signup', (req, res) => {
    res.render('pages/signup.ejs', { message: ''});
});

exports.router = router;