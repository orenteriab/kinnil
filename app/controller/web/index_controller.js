let Router = require('express').Router;
let userRouter = require('./user_controller').router;

const router = Router();

router.use('/users', userRouter);

exports.router = router;