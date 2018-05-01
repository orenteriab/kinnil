let Router = require('express').Router;
let invoiceService = require('../../service/invoice_service');

const router = Router();

router.get('/home', (req, res) => {
    res.render('pages/invoice.ejs')
})


exports.router = router;