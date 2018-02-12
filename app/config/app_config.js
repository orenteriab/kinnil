import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { passport } from './passport_config';
import * as path from 'path';
import * as flash from 'connect-flash';
import { router as apiRouter } from '../controller/api/index_controller';

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

app.listen(PORT, () => {
    console.log(`Running in ${ENV}`);
});