export interface TransactionsView {
    id: number;
    companyId: number;
    budgetId: number | null;
    serviceId: number | null;
    name: string;
    description: string | null;
    value: number;
    type: string | null;
    scheduling: Date | null;
    file: string | null;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionsRaw {
    id: number;
    company_id: number;
    budget_id: number;
    service_id: number;
    name: string;
    description: string;
    value: number;
    type: string;
    scheduling: Date;
    file: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export function processTransaction(raw: TransactionsRaw): TransactionsView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        budgetId: raw.budget_id,
        serviceId: raw.service_id,
        name: raw.name,
        description: raw.description,
        value: raw.value,
        type: raw.type,
        scheduling: raw.scheduling,
        file: raw.file,
        createdBy: raw.created_by,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as TransactionsView;
}

export function TransactionsProperties() {
    return {
        required: [
            "name",
            "value"
        ],
        optional: [
            "budget_id",
            "service_id",
            "description",
            "type",
            "scheduling",
            "file",
        ]
    }
}
