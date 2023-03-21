import { AddressRaw, AddressView, processAddress } from '../types/AddressView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape } from '../modules/Utils';

export class AddressController {
    getAddress = async (companyId: number): Promise<AddressView[]> => {
        try {
            const query = `SELECT * FROM Addresses WHERE company_id = "${companyId}"`;

            const rawAddress = (await execute(query)) as AddressRaw[];

            return rawAddress.map(client => processAddress(client));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getAddressByConstructionId = async (constructionId: number, companyId: number) => {
        try {
            const query = `SELECT * FROM Constructions WHERE id = "${constructionId}" AND company_id = "${companyId}"`;

            const rawConstruction = ((await execute(query)) as any[])[0];

            const query_2 = `SELECT * FROM Addresses WHERE id = "${rawConstruction.address_id}" AND company_id = "${companyId}"`;

            const rawAddress = ((await execute(query_2)) as AddressRaw[])[0];

            if (rawAddress) {
                return processAddress(rawAddress);
            }

            throw {
                status: 404,
                message: "Endereço solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    getAddressByClientId = async (constructionId: number, companyId: number) => {
        try {
            const query = `SELECT * FROM Clients WHERE id = "${constructionId}" AND company_id = "${companyId}"`;

            const rawClient = ((await execute(query)) as any[])[0];

            const query_2 = `SELECT * FROM Addresses WHERE id = "${rawClient.address_id}" AND company_id = "${companyId}"`;

            const rawAddress = ((await execute(query_2)) as AddressRaw[])[0];

            if (rawAddress) {
                return processAddress(rawAddress);
            }

            throw {
                status: 404,
                message: "Endereço solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    getAddressById = async (id: number, companyId: number): Promise<AddressView> => {
        try {
            const query = `SELECT * FROM Addresses WHERE id = "${id}" AND company_id = "${companyId}"`;

            const rawAddress = ((await execute(query)) as AddressRaw[])[0];

            if (rawAddress) {
                return processAddress(rawAddress);
            }

            throw {
                status: 404,
                message: "Endereço solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createAddress = async (companyId: number, info: AddressView): Promise<boolean> => {
        try {
            const query = `
                INSERT INTO Addresses(company_id, cep, state, city, street, district, number)
                VALUES (
                    "${companyId}",
                    "${info.cep}",
                    "${escape(info.state)}",
                    "${escape(info.city)}",
                    "${escape(info.street)}",
                    "${escape(info.district)}",
                    "${info.number}"
                )
            `;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar o endereço."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateAddress = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            let query = `UPDATE Addresses SET `;
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
            query += `WHERE id = ${id} AND company_id = ${companyId}`;


            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível atualizar o endereço."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteAddress = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Addresses WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível remover o endereço."
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
