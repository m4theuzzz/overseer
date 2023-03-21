export interface ServicesView {
    id: number;
    userId: number;
    companyId: number;
    name: string;
    description: string | null;
    employeeRole: string | null;
    mesureUnit: MesureUnits;
    unityCost: number;
    errorMargin: number;
    coefficient: number;
    multiplier: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServicesRaw {
    id: number;
    user_id: number;
    company_id: number;
    name: string;
    description: string | null;
    employee_role: string | null;
    mesure_unit: MesureUnits;
    unity_cost: number;
    error_margin: number;
    coefficient: number;
    multiplier: string;
    created_at: Date;
    updated_at: Date;
}

export enum MesureUnits {
    "m", "m2", "m3", "unit", "day"
}

export function processService(raw: ServicesRaw): ServicesView {
    return {
        id: raw.id,
        userId: raw.user_id,
        companyId: raw.company_id,
        name: raw.name,
        description: raw.description,
        employeeRole: raw.employee_role,
        mesureUnit: raw.mesure_unit,
        unityCost: raw.unity_cost,
        errorMargin: raw.error_margin,
        coefficient: raw.coefficient,
        multiplier: raw.multiplier,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as ServicesView;
}

export function ServicesProperties() {
    return {
        required: [
            "name",
            "mesure_unit",
            "error_margin",
            "coefficient",
            "multiplier",
            "unity_cost"
        ],
        optional: [
            "description",
            "employee_role"
        ]
    }
}
