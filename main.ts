import 'dotenv/config';

import * as express from 'express';
import * as session from 'express-session';

import { join } from 'path';
import { Database } from './src/modules/Database';
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

if (process.env.ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));

const userRoutes = require('./src/routes/UserRoutes');
const authRoutes = require('./src/routes/AuthRoutes');

app.use(express.json());
app.use(express.static('public'));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

app.listen(process.env.APP_PORT, async () => {
    Database.connectDatabase();
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});