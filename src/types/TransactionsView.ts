export interface TransactionsView {
    id: string;
    user_id: string;
    budget_id: string;
    name: string;
    description: string | null;
    value: number;
    type: string | null;
    scheduling: Date;
    file: string | null;
    created_at: Date;
    updated_at: Date;
}