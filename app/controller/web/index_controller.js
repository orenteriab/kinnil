let Router = require('express').Router;
let userRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router

const router = Router();

router.use('/users', userRouter);
router.use('/dispatcher', dispatcherRouter)

exports.router = router;