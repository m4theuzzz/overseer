export interface AddressView {
    id: number;
    companyId: number;
    cep: string;
    state: string;
    city: string;
    street: string;
    district: string;
    number: number;
    createdAt: string;
    updatedAt: string;
}

export interface AddressRaw {
    id: number;
    company_id: number;
    cep: string;
    state: string;
    city: string;
    street: string;
    district: string;
    number: number;
    created_at: string;
    updated_at: string;
}

export function processAddress(raw: AddressRaw): AddressView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        cep: raw.cep,
        state: raw.state,
        city: raw.city,
        street: raw.street,
        district: raw.district,
        number: raw.number,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as AddressView;
}

export function AddressProperties() {
    const array: any[] = [];
    return {
        required: [
            "cep",
            "state",
            "city",
            "street",
            "district",
            "number",
        ],
        optional: array
    }
}
