import { execute } from '../modules/Database';
import { BudgetStatus, budgetStatusTranslate } from '../types/BudgetsView';
import { BudgetReport, ConstructionDurationAverage, Months, TransactionReport } from '../types/ReportsView';
import { BudgetsController } from './BudgetsController';
import { ConstructionsController } from './ConstructionsController';
import { ServicesController } from './ServicesController';

const { getBudgets, getBudgetServices, getBudgetTransactions } = new BudgetsController();
const { getServices } = new ServicesController();
const { getConstructions } = new ConstructionsController();

export class ReportsController {
    getConstructionDurationAverage = async (companyId: number): Promise<ConstructionDurationAverage> => {
        const query = `
            SELECT created_at, updated_at
            FROM Budgets
            WHERE status = "finished"
            AND company_id = ${companyId}
        `;

        const res = (await execute(query)) as any[];

        const durationsInDays: any[] = res.reduce((acc: any[], cur: any) => {
            const startDate = new Date(cur.created_at).getTime();
            const endDate = new Date(cur.updated_at).getTime();

            acc.push((endDate - startDate) / (1000 * 60 * 60 * 24));
            return acc;
        }, []);

        const average = durationsInDays.reduce((acc: number, cur: number) => {
            return acc + cur;
        }, 0) / durationsInDays.length;

        return { average: average }
    }

    private calculateTransactionReport = (transactions: any[]) => {
        if (transactions.length == 0) {
            return null;
        }
        return transactions.reduce((acc, cur) => {
            if (cur.type === "incoming") {
                acc.incoming += cur.value;
            } else {
                acc.outcoming += Math.abs(cur.value);
            }
            return acc;
        }, { incoming: 0, outcoming: 0 });
    }

    getTransactionReport = async (companyId: number): Promise<TransactionReport> => {
        const query = `
            SELECT value, type
            FROM Transactions
            WHERE company_id = ${companyId}
        `;

        const res = (await execute(query)) as any[];

        const { incoming, outcoming } = this.calculateTransactionReport(res) ?? { incoming: null, outcoming: null };

        return {
            incoming: Number(incoming.toFixed(2)),
            outcoming: Number(outcoming.toFixed(2)),
            liquid: Number((incoming - outcoming).toFixed(2))
        }
    }

    private separateByMonth = (array: any[]) => {
        return array.reduce((acc: any, cur: any) => {
            const createdAt = new Date(cur.created_at);
            const key = createdAt.getMonth();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(cur);
            return acc;
        }, {});
    }

    translateMonth = (month: number) => {
        switch (month) {
            case 0:
                return "Jan"
            case 1:
                return "Fev"
            case 2:
                return "Mar"
            case 3:
                return "Abr"
            case 4:
                return "Mai"
            case 5:
                return "Jun"
            case 6:
                return "Jul"
            case 7:
                return "Ago"
            case 8:
                return "Set"
            case 9:
                return "Out"
            case 10:
                return "Nov"
            case 11:
                return "Dez"

            default:
                return month;
        }
    }

    getIntByMonths = async (companyId: number, service: string) => {
        const query = `SELECT * from ${service} WHERE company_id = ${companyId}`;
        const res = (await execute(query)) as any[];

        const separated = this.separateByMonth(res);

        return Object.keys(separated).reduce((acc, month) => {
            acc.push({
                month: this.translateMonth(Number(month)),
                total: separated[month].length
            });
            return acc;
        }, []);
    }

    getTransactionsReportByMonth = async (companyId: number) => {
        const query = `
            SELECT *
            FROM Transactions
            WHERE company_id = ${companyId}
        `;

        const res = (await execute(query)) as any[];

        const separated = this.separateByMonth(res);

        return Object.keys(separated).reduce((acc, month) => {
            acc.push({
                month: this.translateMonth(Number(month)),
                ...this.calculateTransactionReport(separated[month])
            });
            return acc;
        }, []);
    }

    getIncomingMargin = async (companyId: number) => {
        const query = `
            SELECT incoming_margin
            FROM Constructions
            WHERE company_id = ${companyId}
        `;

        const res = (await execute(query)) as any[];

        const sum = res.reduce((acc: number, cur: any) => {
            return acc += cur.incoming_margin
        }, 0);

        return { average: sum / res.length };
    }

    getBudgetsReport = async (companyId: number) => {
        const budgets = await getBudgets(companyId);
        const services = await getServices(companyId);
        const constructions = await getConstructions(companyId);

        const budgetReports: BudgetReport[] = [];
        await Promise.all(budgets.map(async (budget) => {
            const construction = constructions.find(construct => construct.id === budget.constructionId);
            const budgetServices = await getBudgetServices(budget.id, companyId);
            const budgetTransactions = await getBudgetTransactions(budget.id, companyId);

            const { budgetedTotal, totalServices } = budgetServices.reduce((accd, budgetService) => {
                const service = services.find(serv => serv.id === budgetService.serviceId);
                const serviceCalc = Number(budgetService.quantity) * service.unityCost;
                accd.budgetedTotal += serviceCalc + (serviceCalc * service.errorMargin) + (serviceCalc * construction.incomingMargin);
                accd.totalServices += 1;
                return accd;
            }, { budgetedTotal: 0, totalServices: 0 });

            const { incoming, outcoming, totalTransactions } = budgetTransactions.reduce((acct, transaction) => {
                if (transaction.type === "incoming") {
                    acct.incoming += transaction.value;
                } else {
                    acct.outcoming += transaction.value;
                }
                acct.totalTransactions += 1;
                return acct;
            }, { incoming: 0, outcoming: 0, totalTransactions: 0 });

            const budgetStartDate = new Date(budget.createdAt);
            const constructionStartDate = budget.constructionStart ? new Date(budget.constructionStart) : null;
            const constructionEndDate = budget.constructionEnd ? new Date(budget.constructionEnd) : null;
            const constructionTime = budget.constructionStart && budget.constructionEnd ? Math.ceil((constructionEndDate.getTime() - constructionStartDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
            const leadTime = Math.ceil((constructionEndDate.getTime() - budgetStartDate.getTime()) / (1000 * 60 * 60 * 24));

            budgetReports.push({
                budgetedTotal: budgetedTotal,
                incoming: Number(incoming.toFixed(2)),
                outcoming: Number(outcoming.toFixed(2)),
                liquid: Number((incoming - outcoming).toFixed(2)),
                startDate: budgetStartDate,
                endDate: budgetStatusTranslate(String(budget.status)) === BudgetStatus.finished ? constructionEndDate : null,
                leadTime: budgetStatusTranslate(String(budget.status)) === BudgetStatus.finished ? leadTime : null,
                constructionTime: constructionTime,
                numberOfServices: totalServices,
                numberOfTransactions: totalTransactions,
                status: budget.status,
                createdBy: budget.createdBy,
                budgetId: budget.id,
                clientId: budget.clientId,
                constructionId: budget.constructionId
            } as BudgetReport);
        }));

        return budgetReports;
    }
}