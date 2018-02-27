const ROUTER = require('express').Router();
const MULTER = require('multer');
const STORAGE = MULTER.memoryStorage();
const UPLOAD_HANDLER = MULTER({ storage: STORAGE });

ROUTER.post('/upload-csv',
    UPLOAD_HANDLER.single('csv_file'),
    (req, res) => {
        //req.file contains all the file information
        //we just need a way to dump it. Adding csv to json
        //later.
        res.send('file uploaded');
    });

exports.router = ROUTER;