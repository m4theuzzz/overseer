import { BudgetStatus } from "./BudgetsView";

export enum Months {
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
}

export interface ConstructionDurationAverage {
    average: number;
}

export interface TransactionReport {
    incoming: number;
    outcoming: number;
    liquid: number;
}

export interface BudgetReport {
    budgetedTotal: number;
    incoming: number | null;
    outcoming: number | null;
    liquid: number | null;
    startDate: Date;
    endDate: Date | null;
    leadTime: number | null;
    constructionTime: number | null;
    numberOfServices: number | null;
    numberOfTransactions: number;
    status: BudgetStatus;
    createdBy: number;
    budgetId: number;
    constructionId: number;
    clientId: number;
}
