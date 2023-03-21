import { processTransaction, TransactionsRaw, TransactionsView } from '../types/TransactionsView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape } from '../modules/Utils';

export class TransactionsController {
    getTransactions = async (companyId: number): Promise<TransactionsView[]> => {
        try {
            const query = `SELECT * FROM Transactions WHERE company_id = "${companyId}"`;

            const rawTransactions = (await execute(query)) as TransactionsRaw[];

            return rawTransactions.map(transaction => processTransaction(transaction));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getTransactionById = async (id: number, companyId: number): Promise<TransactionsView> => {
        try {
            const query = `SELECT * FROM Transactions WHERE id = "${id}" AND company_id = "${companyId}"`;

            const transaction = ((await execute(query)) as TransactionsRaw[])[0];

            if (transaction) {
                return processTransaction(transaction);
            }

            throw {
                status: 404,
                message: "A transação solicitada não foi encontrada."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createTransaction = async (userId: number, companyId: number, info: TransactionsView): Promise<boolean> => {
        try {
            const query = `
                INSERT INTO Transactions(
                    company_id,
                    name,
                    value,
                    budget_id,
                    service_id,
                    description,
                    type,
                    scheduling,
                    file,
                    created_by
                ) VALUES (
                    "${companyId}",
                    "${info.name}",
                    "${info.value}",
                    ${info.budgetId ? '"' + escape(info.budgetId) + '"' : null},
                    ${info.serviceId ? '"' + escape(info.serviceId) + '"' : null},
                    ${info.description ? '"' + escape(info.description) + '"' : null},
                    ${info.type ? '"' + escape(info.type) + '"' : null},
                    ${info.scheduling ? '"' + escape(info.scheduling) + '"' : null},
                    ${info.file ? '"' + escape(info.file) + '"' : null},
                    "${userId}"
                )
            `;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar a transação."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateTransaction = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            let query = `UPDATE Transactions SET `;
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
                    message: "Você não pode atualizar esta transação."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteTransaction = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Transactions WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível remover a transação."
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
