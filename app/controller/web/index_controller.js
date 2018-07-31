let Router = require('express').Router;
let userRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;
let administrativeRouter = require('./administrative_controller').router;
let loginRouter = require('./login_controller').router;
let passportVerification = require('../../config/passport_config').isLoggedIn;
let asssetsRouter = require('./assets_controller').router;
let invoiceRouter = require('./invoice_controller').router;
let payrollRouter = require('./payroll_controller').router;
let goalsRouter = require('./goals_controller').router;
let reportsRouter = require('./reports_controller').router;

const router = Router();

router.use('/login', loginRouter);
router.use('/users', passportVerification, userRouter);
router.use('/dispatcher', passportVerification, dispatcherRouter);
router.use('/administrative', passportVerification, administrativeRouter);
router.use('/assets', passportVerification, asssetsRouter)
router.use('/invoice', passportVerification, invoiceRouter)
router.use('/payroll', passportVerification, payrollRouter)
router.use('/goals', goalsRouter)
router.use('/reports', passportVerification, reportsRouter)

exports.router = router;
