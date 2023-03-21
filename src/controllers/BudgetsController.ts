import { BudgetsRaw, BudgetsView, processBudget } from '../types/BudgetsView';
import { BudgetServicesRaw, BudgetServicesView, processBudgetService } from '../types/BudgetServicesView'
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape } from '../modules/Utils';
import { processTransaction, TransactionsRaw, TransactionsView } from '../types/TransactionsView';

export class BudgetsController {
    getBudgets = async (companyId: number): Promise<BudgetsView[]> => {
        try {
            const query = `SELECT * FROM Budgets WHERE company_id = "${companyId}"`;

            const rawBudgets = (await execute(query)) as BudgetsRaw[];

            return rawBudgets.map(budget => processBudget(budget));

        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getBudgetById = async (id: number, companyId: number): Promise<BudgetsView> => {
        try {
            const query = `SELECT * FROM Budgets WHERE id = "${id}" AND company_id = "${companyId}"`;

            const budget = ((await execute(query)) as BudgetsRaw[])[0];

            if (budget) {
                return processBudget(budget);
            }

            throw {
                status: 404,
                message: "O orçamento solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    getBudgetServicesCosts = async (budgetId: number, companyId: number) => {
        try {
            const query = `
                SELECT *
                FROM Transactions
                WHERE company_id = ${companyId}
                AND budget_id = ${budgetId};
            `;

            const res = (await execute(query)) as any[];

            const getIndexFromArray = (array: any[], id: string) => {
                for (let i = 0; i < array.length; i++) {
                    if (array[i].serviceId == id) {
                        return i;
                    }
                }

                return null;
            }

            const servicesCosts = res.reduce((acc, cur) => {
                const index = getIndexFromArray(acc, cur.service_id);

                if (index !== null) {
                    if (cur.type === "incoming") {
                        acc[index].totalServico += cur.value;
                    } else {
                        acc[index].totalServico -= cur.value;
                    }
                } else {
                    if (cur.type === "incoming") {
                        acc.push({ serviceId: cur.service_id, totalServico: cur.value })
                    } else {
                        acc.push({ serviceId: cur.service_id, totalServico: -1 * cur.value })
                    }
                }

                return acc;
            }, []);

            return servicesCosts;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    getBudgetServices = async (budgetId: number, companyId: number): Promise<BudgetServicesView[]> => {
        try {
            const query = `SELECT * FROM BudgetServices WHERE budget_id = "${budgetId}" AND company_id = "${companyId}"`;

            const rawBudgetServices = (await execute(query)) as BudgetServicesRaw[];

            if (rawBudgetServices) {
                const budgetServices = rawBudgetServices.map(budgetService => processBudgetService(budgetService));
                return budgetServices;
            }

            throw {
                status: 404,
                message: "O orçamento solicitado não foi encontrado."
            } as RequestException;
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    getBudgetTransactions = async (budgetId: number, companyId: number): Promise<TransactionsView[]> => {
        try {
            const query = `SELECT * FROM Transactions WHERE company_id = "${companyId}" AND budget_id = "${budgetId}"`;

            const rawTransactions = (await execute(query)) as TransactionsRaw[];

            return rawTransactions.map(transaction => processTransaction(transaction));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    createBudget = async (userId: number, companyId: number, info: BudgetsView): Promise<boolean> => {
        try {
            const query = `
                INSERT INTO Budgets(company_id, client_id, construction_id, name, status, created_by)
                VALUES (
                    "${companyId}",
                    "${info.clientId}",
                    "${info.constructionId}",
                    "${info.name}",
                    ${info.status ? '"' + info.status + '"' : "'budget'"},
                    "${userId}"
                )
            `;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar o orçamento."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    createBudgetService = async (companyId: number, budgetId: number, info: BudgetServicesView): Promise<boolean> => {
        try {
            const query = `
                INSERT INTO BudgetServices(
                    company_id,
                    budget_id,
                    service_id,
                    quantity,
                    sector,
                    deadline,
                    status,
                    type,
                    overrides
                )
                VALUES (
                    "${companyId}",
                    "${budgetId}",
                    "${info.serviceId}",
                    "${info.quantity}",
                    "${info.sector}",
                    ${info.deadline ? '"' + escape(info.deadline) + '"' : null},
                    ${info.status ? '"' + escape(info.status) + '"' : "'ok'"},
                    ${info.type ? '"' + escape(info.type) + '"' : "'default'"},
                    ${info.overrides ? '"' + escape(info.overrides) + '"' : null}
                );
            `;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 500,
                    message: "Não foi possível cadastrar o orçamento."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: e.status || 500,
                message: e.message
            } as RequestException;
        }
    }

    updateBudget = async (id: number, info: any, companyId: number): Promise<boolean> => {
        try {
            let query = `UPDATE Budgets SET `;
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
                    message: "Você não pode atualizar este orçamento."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    updateBudgetService = async (budgetServiceId: number, companyId: number, info: any): Promise<boolean> => {
        try {
            let query = `UPDATE BudgetServices SET `;
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
            query += `WHERE id = "${budgetServiceId}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true;
            } else {
                throw {
                    status: 403,
                    message: "Você não pode atualizar este orçamento."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteBudget = async (id: number, companyId: number): Promise<boolean> => {
        try {
            const query = `DELETE FROM Budgets WHERE id = "${id}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 403,
                    message: "Você não possui permissão para apagar esse orçamento."
                } as RequestException;
            }
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteBudgetService = async (budgetServiceId: number, companyId: number) => {
        try {
            const query = `DELETE FROM BudgetServices WHERE id = "${budgetServiceId}" AND company_id = "${companyId}"`;

            const response: any = await execute(query);

            if (response.affectedRows !== 0) {
                return true
            } else {
                throw {
                    status: 403,
                    message: "Você não possui permissão para apagar esse serviço orçado."
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
