import 'dotenv/config';
import { createConnection, Connection } from 'mysql';

let connection: Connection;

export class Database {

    static connectDatabase = () => {
        connection = createConnection({
            host: process.env.DB_SERVER,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_PORT)
        });
    }

    static execute = <T>(query: string, params: Object = {}): Promise<T> => {
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
}