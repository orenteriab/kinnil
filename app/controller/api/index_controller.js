let Router = require('express').Router;
let usersRouter = require('./user_controller').router;
let dispatcherRouter = require('./dispatcher_controller').router;
let ticketRouter = require('./tickets_controller').router;
let administrativeRouter = require('./administrative_controller').router;
let assetsRouter = require('./assets_controller').router
let invoiceRouter = require('./invoice_controller').router
let payrollRouter = require('./payroll_controller').router
let goalsRouter = require('./goals_controller').router
let reportsRouter = require('./reports_controller').router

const router = Router();
router.use('/users', usersRouter);
router.use('/dispatcher', dispatcherRouter);
router.use('/tickets', ticketRouter);
router.use('/administrative', administrativeRouter);
router.use('/assets', assetsRouter)
router.use('/invoice', invoiceRouter)
router.use('/payroll', payrollRouter)
router.use('/goals', goalsRouter)
router.use('/reports', reportsRouter)

exports.router = router;
