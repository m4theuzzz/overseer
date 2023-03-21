export interface BudgetsView {
    id: number;
    companyId: number;
    clientId: number;
    constructionId: number;
    name: string,
    status: BudgetStatus;
    constructionStart: Date;
    constructionEnd: Date;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BudgetsRaw {
    id: number;
    company_id: number;
    client_id: number;
    construction_id: number;
    name: string,
    status: BudgetStatus;
    construction_start: Date;
    construction_end: Date;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export enum BudgetStatus {
    "budget", "construction", "finished"
}

export const budgetStatusTranslate = (status: string) => {
    switch (status) {
        case "budget":
            return BudgetStatus.budget;
        case "construction":
            return BudgetStatus.construction;
        case "finished":
            return BudgetStatus.finished;
        default:
            return status;
    }
}

export function processBudget(raw: BudgetsRaw): BudgetsView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        clientId: raw.client_id,
        constructionId: raw.construction_id,
        name: raw.name,
        status: raw.status,
        constructionStart: raw.construction_start,
        constructionEnd: raw.construction_end,
        createdBy: raw.created_by,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as BudgetsView;
}

export function BudgetsProperties() {
    const array: any[] = [];
    return {
        required: [
            "client_id",
            "construction_id",
            "name"
        ],
        optional: [
            "status",
            "construction_start",
            "construction_end"
        ]
    }
}
