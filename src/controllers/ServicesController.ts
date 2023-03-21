import { processService, ServicesRaw, ServicesView } from '../types/ServicesView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape } from '../modules/Utils';

export class ServicesController {
    getServices = async (companyId: number): Promise<ServicesView[]> => {
        try {
            const query = `SELECT * FROM Services WHERE company_id = "${companyId}"`;

            const rawServices = (await execute(query)) as ServicesRaw[];

            return rawServices.map(service => processService(service));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getServiceById = async (id: number, companyId: number): Promise<ServicesView> => {
        try {
            const query = `SELECT * FROM Services WHERE id = "${id}" AND company_id = "${companyId}"`;

            const rawService = ((await execute(query)) as ServicesRaw[])[0];

            if (rawService) {
                return processService(rawService);
            }

            throw {
                status: 404,
                message: "Serviço solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createService = async (userId: number, companyId: number, info: any): Promise<boolean> => {
        try {
            const query = `
                INSERT INTO Services(company_id, name, description, employee_role, mesure_unit, unity_cost, error_margin, coefficient, multiplier, created_by)
                VALUES (
                    "${companyId}",
                    "${escape(info.name)}",
                    ${info.description ? '"' + escape(info.description) + '"' : null},
                    ${info.employee_role ? '"' + escape(info.employee_role) + '"' : null},
                    "${escape(info.mesure_unit)}",
                    "${escape(info.unity_cost)}",
                    "${escape(info.error_margin)}",
                    "${escape(info.coefficient)}",
                    "${escape(info.multiplier)}",
                    "${userId}"
                    )`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar o serviço."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateService = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            let query = `UPDATE Services SET `;
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
                return true;
            } else {
                throw {
                    status: 403,
                    message: "Não foi possível atualizar o serviço."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteService = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Services WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 403,
                    message: "Não foi possível remover o serviço."
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
