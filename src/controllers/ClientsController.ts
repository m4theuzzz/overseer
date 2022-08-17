import { ClientsView } from '../types/ClientsView';
import { Database } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import e = require('express');

export class ClientsController {
    getClients = async (): Promise<ClientsView[]> => {
        try {
            const query = `SELECT * FROM Clients`;

            return (await Database.execute(query)) as ClientsView[];
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getClientById = async (id: string): Promise<ClientsView> => {
        try {
            const query = `SELECT * FROM Clients WHERE id = "${id}"`;

            const client = ((await Database.execute(query)) as ClientsView[])[0];

            if (client) {
                return client;
            }

            throw {
                status: 404,
                message: "Cliente solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createClient = async (userId: string, info: ClientsView): Promise<boolean> => {
        try {
            const query = `
            INSERT INTO Clients(user_id, name, cpf_cnpj, email, phone, address)
            VALUES ("${userId}", "${info.name}", "${info.cpf_cnpj}", "${info.email}", "${info.phone}", "${info.address}")`;
            const response: any = await Database.execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar o cliente."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateClient = async (id: string, info: any): Promise<boolean> => {
        try {
            let query = `UPDATE Clients SET `;
            let i = 0;
            for (let key in info) {
                query += `${key} = "${info[key]}"`;

                if (i == (Object.keys(info).length - 1)) {
                    query += " ";
                    continue;
                }
                query += ", ";
                i++;
            }
            query += `WHERE id = "${id}"`;

            const response: any = await Database.execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível atualizar o cliente."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteClient = async (id: string): Promise<boolean> => {
        try {
            const query = `DELETE FROM Clients WHERE id = "${id}"`;

            const response: any = await Database.execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível remover o cliente."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }
}
