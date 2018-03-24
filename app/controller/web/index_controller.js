let Router = require('express').Router;
let userRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;
let administrativeRouter = require('./administrative_controller').router;
let loginRouter = require('./login_controller').router;
let passportVerification = require('../../config/passport_config').isLoggedIn;

const router = Router();

router.use('/login', loginRouter);
router.use('/users', passportVerification, userRouter);
router.use('/dispatcher', passportVerification, dispatcherRouter);
router.use('/administrative', passportVerification, administrativeRouter);

exports.router = router;
