let Router = require('express').Router;
let usersRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;

const router = Router();
router.use('/users', usersRouter);
router.use('/dispatcher', dispatcherRouter);

exports.router = router;