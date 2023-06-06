import 'dotenv/config';

import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';

import { connect } from './src/modules/Database';
import { randomUUID } from 'crypto';

const app = express();

const sess = {
    secret: 'keybord cat',
    genid: () => randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60,
    }
}

if (process.env.ENV === 'prod') {
    const allowedOrigins = ['https://overseer-2oe4yrtbla-rj.a.run.app'];
    app.use(cors({
        origin: function (origin: any, callback: any) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));

    app.set('trust proxy', 1);
    sess.cookie.secure = true;
} else {
    app.use(cors());
}

app.use(session(sess));

const authRoutes = require('./src/routes/AuthRoutes');
const usersRoutes = require('./src/routes/UsersRoutes');
const clientsRoutes = require('./src/routes/ClientsRoutes');
const constructionsRoutes = require('./src/routes/ConstructionsRoutes');
const budgetsRoutes = require('./src/routes/BudgetsRoutes');
const transactionsRoutes = require('./src/routes/TransactionsRoutes');
const servicesRoutes = require('./src/routes/ServicesRoutes');
const addressRoutes = require('./src/routes/AddressRoutes');
const reportsRoutes = require('./src/routes/ReportsRoutes');
const mailerRoutes = require('./src/routes/MailerRoutes');
const exportsRoutes = require('./src/routes/ExportsRoutes');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static('frontend'));


app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/clients', clientsRoutes);
app.use('/constructions', constructionsRoutes);
app.use('/budgets', budgetsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/services', servicesRoutes);
app.use('/address', addressRoutes);
app.use('/reports', reportsRoutes);
app.use('/mailer', mailerRoutes);
app.use('/exports', exportsRoutes);

app.listen(process.env.API_PORT, async () => {
    connect();
    console.log(`A API overseer está online na porta: ${process.env.API_PORT}`);
});
