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

const userNameMiddleware = (req, res, next) => {
    let username = '' 
    
    if(req.user != undefined && req.user != null){
        username = req.user.username
    }

    res.locals.user = {
        'username': username
    }
    
    next()
}

const app = express();

app.set('views', path.join(__dirname, '..', 'view'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(userNameMiddleware)
app.use(flash());

const PORT = process.env.port || 3000;
const ENV = process.env.NODE_ENV || 'PROD';

app.use('/api', apiRouter);
app.use('/web', webRouter);
app.get('/', (req, res) => res.redirect('/web/login/'));

let server = app.listen(PORT, () => {
    console.log(`Running in ${ENV} on port ${PORT}.`);
});

require('./socket_config').init(server);

/**
 * https://gist.github.com/orenteriab/f4a8ff83758c3e43ec710415b64d27ec
 */