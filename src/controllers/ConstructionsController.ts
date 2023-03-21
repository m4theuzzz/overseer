import { buildRawConstruction, ConstructionsRaw, ConstructionsView, processConstruction } from '../types/ConstructionsView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape, verifyIntegrity } from '../modules/Utils';
import { AddressController } from './AddressController';

const addressController = new AddressController();

export class ConstructionsController {
    getConstructions = async (companyId: number): Promise<ConstructionsView[]> => {
        try {
            const query = `
                SELECT
                    C.id as c_id,
                    C.client_id as c_client_id,
                    C.company_id as c_company_id,
                    C.name as c_name,
                    C.incoming_margin as c_incoming_margin,
                    C.teams as c_teams,
                    C.created_by as c_created_by,
                    C.created_at as c_created_at,
                    C.updated_at as c_updated_at,
                    A.*
                FROM Constructions as C
                INNER JOIN Addresses as A
                ON A.id = C.address_id
                WHERE C.company_id = "${companyId}"
            `;

            const constructions = (await execute(query)) as any[];
            const rawConstructions: ConstructionsRaw[] = [];

            for (const raw of constructions) {
                rawConstructions.push(buildRawConstruction(raw));
            }

            return rawConstructions.map(construction => processConstruction(construction));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getConstructionById = async (id: number, companyId: number): Promise<ConstructionsView> => {
        try {
            const query = `
                SELECT
                    C.id as c_id,
                    C.client_id as c_client_id,
                    C.company_id as c_company_id,
                    C.name as c_name,
                    C.incoming_margin as c_incoming_margin,
                    C.teams as c_teams,
                    C.created_by as c_created_by,
                    C.created_at as c_created_at,
                    C.updated_at as c_updated_at,
                    A.*
                FROM Constructions as C
                INNER JOIN Addresses as A
                ON A.id = C.address_id
                WHERE C.id = "${id}"
                AND C.company_id = "${companyId}"
            `;

            const construction = ((await execute(query)) as any[])[0];

            if (construction) {
                const rawConstruction = buildRawConstruction(construction);
                return processConstruction(rawConstruction);
            }

            throw {
                status: 404,
                message: "Obra solicitada não foi encontrada."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createConstruction = async (userId: number, companyId: number, info: ConstructionsView): Promise<boolean> => {
        try {
            await addressController.createAddress(companyId, info.address);

            const getAddressId = `SELECT LAST_INSERT_ID() FROM Addresses WHERE company_id = ${companyId} `

            const addressIdRequest = (await execute(getAddressId)) as any[];
            const addressId = addressIdRequest[0]['LAST_INSERT_ID()'];

            const query = `
                INSERT INTO Constructions(company_id, client_id, name, address_id, created_by)
                VALUES (
                    "${companyId}",
                    "${escape(info.clientId)}",
                    "${escape(info.name)}",
                    "${addressId}",
                    "${userId}"
                )
            `;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar a obra."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateConstruction = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            const addressInfo = info.address;
            delete info.address;

            let query = `UPDATE Constructions SET `;
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
            query += `WHERE id = "${id}" AND company_id = "${companyId}";`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                if (addressInfo && verifyIntegrity('Address', addressInfo)) {
                    const rawAddress = await addressController.getAddressByConstructionId(id, companyId);
                    await addressController.updateAddress(rawAddress.id, addressInfo, companyId);
                }

                return true;
            } else {
                throw {
                    status: 403,
                    message: "Você não possui permissão para atualizar esta obra."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteConstruction = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Constructions WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível remover a obra."
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
