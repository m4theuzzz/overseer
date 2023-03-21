export interface CompanyView {
    id: number;
    name: string;
    cnpj: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
}

export interface CompanyRaw {
    id: number;
    name: string;
    cnpj: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export function processCompany(raw: CompanyRaw): CompanyView {
    return {
        id: raw.id,
        name: raw.name,
        cnpj: raw.cnpj,
        logo: raw.logo,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as CompanyView;
}

export function CompanyProperties() {
    return {
        required: [
            "name",
            "cnpj",
        ],
        optional: [
            "logo"
        ]
    }
}