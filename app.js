// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();

var passport = require('passport');
var flash    = require('connect-flash');

// Tools from myexpressapp
var path = require('path');
var favicon = require('serve-favicon');

// Look, a performance monitor tool
// TODO: Make this work
//require('look').start();

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({	extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.static(path.join(__dirname, '/public'))); // static content


// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
var index = require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

module.exports = app;

// TODO: hacer que node corra con variables de ambiente
console.log("Running in :"  + process.env.NODE_ENV);

