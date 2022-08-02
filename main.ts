import 'dotenv/config';
import mysql from 'mysql';
import { Request, Response } from 'express';
import express from 'express';
import path from 'path';

const app = express();

async function connectDatabase() {
    try {
        const connection = mysql.createConnection(
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
    res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

app.listen(process.env.APP_PORT, async () => {
    await connectDatabase();
    console.log(`Example app listening on port ${process.env.APP_PORT}`);
});