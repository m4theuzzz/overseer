import 'dotenv/config';
import { createConnection, Connection } from 'mysql';

let connection: Connection;

export function connect() {
    connection = createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT)
    });
}

export function execute<T>(query: string, params: Object = {}): Promise<T> {
    try {
        if (!connection) throw new Error("Conexão com banco não foi estabelecida.");

        return new Promise<T>((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) reject(err);

                resolve(results);
            });
        });

    } catch (error) {
        console.log('MySQL error: ', error);
    }
}
