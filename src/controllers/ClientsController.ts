import { buildRawClient, ClientsRaw, ClientsView, processClient } from '../types/ClientsView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape, verifyIntegrity } from '../modules/Utils';
import { AddressController } from './AddressController';

const addressController = new AddressController();

export class ClientsController {
    getClients = async (companyId: number): Promise<ClientsView[]> => {
        try {
            const query = `
                SELECT
                    C.id as c_id,
                    C.company_id as c_company_id,
                    C.name as c_name,
                    C.cpf_cnpj as c_cpf_cnpj,
                    C.email as c_email,
                    C.phone as c_phone,
                    C.created_by as c_created_by,
                    C.created_at as c_created_at,
                    C.updated_at as c_updated_at,
                    A.*
                FROM Clients as C
                INNER JOIN Addresses as A
                ON A.id = C.address_id
                WHERE C.company_id = "${companyId}"
            `;

            const clients = (await execute(query)) as any[];
            const rawClients: ClientsRaw[] = [];

            for (const raw of clients) {
                rawClients.push(buildRawClient(raw))
            }

            return rawClients.map(client => processClient(client));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getClientById = async (id: number, companyId: number): Promise<ClientsView> => {
        try {
            const query = `
                SELECT
                    C.id as c_id,
                    C.company_id as c_company_id,
                    C.name as c_name,
                    C.cpf_cnpj as c_cpf_cnpj,
                    C.email as c_email,
                    C.phone as c_phone,
                    C.created_by as c_created_by,
                    C.created_at as c_created_at,
                    C.updated_at as c_updated_at,
                    A.*
                FROM Clients as C
                INNER JOIN Addresses as A
                ON A.id = C.address_id
                WHERE C.id = "${id}"
                AND C.company_id = "${companyId}"
            `;

            const client = ((await execute(query)) as ClientsRaw[])[0];

            if (client) {
                const rawClient = buildRawClient(client);
                return processClient(rawClient);
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

    createClient = async (userId: number, companyId: number, info: ClientsView): Promise<boolean> => {
        try {
            let addressId = null;
            if (info.address) {
                await addressController.createAddress(companyId, info.address);

                const getAddressId = `SELECT LAST_INSERT_ID() FROM Addresses WHERE company_id = ${companyId}`
                const addressIdRequest = (await execute(getAddressId)) as any[];

                addressId = addressIdRequest[0]['LAST_INSERT_ID()'];
            }

            const query = `
                INSERT INTO Clients(company_id, name, cpf_cnpj, email, created_by, phone, address_id)
                VALUES (
                    "${companyId}",
                    "${escape(info.name)}",
                    "${escape(info.cpfCnpj)}",
                    "${escape(info.email)}",
                    "${userId}",
                    ${info.phone ? '"' + escape(info.phone) + '"' : null},
                    ${addressId}
                )
            `;

            const response: any = await execute(query);

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

    updateClient = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            const addressInfo = info.address;
            delete info.address;

            let query = `UPDATE Clients SET `;
            let i = 0;
            for (let key in info) {
                query += info[key] ? `${key} = "${escape(info[key])}"` : `${key} = ${info[key]}`;

                if (i == (Object.keys(info).length - 1)) {
                    query += " ";
                    continue;
                }
                query += ", ";
                i++;
            }
            query += `WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                if (addressInfo && verifyIntegrity('Address', addressInfo)) {
                    const rawAddress = await addressController.getAddressByClientId(id, companyId);
                    await addressController.updateAddress(rawAddress.id, addressInfo, companyId);
                }

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

    deleteClient = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Clients WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            return true;
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }
}
