let Router = require('express').Router;
let usersRouter = require('./user_controller').router;

const router = Router();
router.use('/users', usersRouter);

exports.router = router;