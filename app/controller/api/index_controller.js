let Router = require('express').Router;
let usersRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;
let ticketRouter = require('./tickets_controller').router;
let administrativeRouter = require('./administrative_controller').router;

const router = Router();
router.use('/users', usersRouter);
router.use('/dispatcher', dispatcherRouter);
router.use('/tickets', ticketRouter);
router.use('/administrative', administrativeRouter);

exports.router = router;
