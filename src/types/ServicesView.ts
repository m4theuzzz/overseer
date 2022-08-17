export interface ServicesView {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    employee_role: string | null;
    mesure_unit: string;
    daily_cost: number | null;
    hour_cost: number | null;
    sq_meter_cost: number | null;
    error_margin: number;
    coefficient: number;
    multiplier: string;
    created_at: Date;
    updated_at: Date;
}