export interface BudgetServicesView {
    id: number;
    companyId: number;
    budgetId: number;
    serviceId: number;
    quantity: string;
    sector: string;
    deadline: string | null;
    status: string | null;
    type: string | null;
    overrides: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BudgetServicesRaw {
    id: number;
    company_id: number;
    budget_id: number;
    service_id: number;
    quantity: string;
    sector: string;
    deadline: string | null;
    status: string | null;
    type: string | null;
    overrides: string | null;
    created_at: string;
    updated_at: string;
}

export enum BudgetServicesType {
    "default", "added"
}

export enum BudgetServicesStatus {
    "ok", "overwritten", "removed"
}

export function processBudgetService(raw: BudgetServicesRaw): BudgetServicesView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        budgetId: raw.budget_id,
        serviceId: raw.service_id,
        quantity: raw.quantity,
        sector: raw.sector,
        deadline: raw.deadline,
        status: raw.status,
        type: raw.type,
        overrides: raw.overrides,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as BudgetServicesView;
}

export function BudgetServicesProperties() {
    return {
        required: [
            "service_id",
            "quantity",
            "sector"
        ],
        optional: [
            "deadline",
            "status",
            "type",
            "overrides"
        ]
    }
}
