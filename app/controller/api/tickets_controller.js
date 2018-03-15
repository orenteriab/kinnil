const ROUTER = require('express').Router();
//const MULTER = require('multer');
//const STORAGE = MULTER.memoryStorage();
//const UPLOAD_HANDLER = MULTER({ storage: STORAGE });

ROUTER.post('/upload/csv', (req, res) => {
    res.json({ message: `${req.body.record['TMS Load #']} received!` });
});

exports.router = ROUTER;