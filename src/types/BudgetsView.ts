export interface BudgetsView {
    id: string;
    user_id: string;
    construction_id: string;
    service_id: string;
    quantity: number;
    sector: string | null;
    deadline: Date | null;
    status: string | null;
    created_at: Date;
    updated_at: Date;
}