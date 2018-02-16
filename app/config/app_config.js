let express = require('express');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let passport = require('./passport_config').passport;
let path = require('path');
let flash= require('connect-flash');
let apiRouter = require('../controller/api/index_controller').router;
let webRouter = require('../controller/web/index_controller').router;

const sessionMiddleware = session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
});

const app = express();

app.set('views', path.join(__dirname, '..', 'view'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const PORT = process.env.port || 3000;
const ENV = process.env.NODE_ENV || 'DEV';

app.use('/api', apiRouter);
app.use('/web', webRouter);

app.listen(PORT, () => {
    console.log(`Running in ${ENV} on port ${PORT}.`);
});