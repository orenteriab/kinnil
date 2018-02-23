let Router = require('express').Router;
let usersRouter = require('./user_controller').router;
let ticketRouter = require('./tickets_controller').router;

const ROUTER = Router();
ROUTER.use('/users', usersRouter);
ROUTER.use('/tickets', ticketRouter);

exports.router = ROUTER;