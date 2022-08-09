import 'dotenv/config';
import { Request, Response } from 'express';
import { join } from 'path';
import { Database } from './src/modules/Database';
import { randomUUID } from 'crypto';

const express = require('express');
const session = require('express-session');
const app = express();

const userRoutes = require('./src/routes/UserRoutes');

var sess = {
    secret: 'keybord cat',
    genid: () => randomUUID(),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60,
    }
};

if (process.env.ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess));
app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

app.listen(process.env.APP_PORT, async () => {
    Database.connectDatabase();
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});