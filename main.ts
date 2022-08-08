import 'dotenv/config';
import { createConnection } from 'mysql';
import { Request, Response } from 'express';
import { join } from 'path';

const express = require('express');
const app = express();

async function connectDatabase() {
    try {
        const connection = createConnection(
            `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        );
        console.log("Banco de Dados conectado");
        return connection;
    } catch (error) {
        console.log("Falha ao Conectar no Banco de Dados");
    }
}

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, 'public/index.html'));
});

app.listen(process.env.APP_PORT, async () => {
    await connectDatabase();
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});