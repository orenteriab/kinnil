let Router = require('express').Router;
let userRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;
let administrativeRouter = require('./administrative_controller').router;

const router = Router();

router.use('/users', userRouter);
router.use('/dispatcher', dispatcherRouter);
router.use('/administrative', administrativeRouter);

exports.router = router;
