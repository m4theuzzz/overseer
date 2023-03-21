import { AddressRaw, AddressView, processAddress } from "./AddressView";

export interface ClientsView {
    id: number;
    companyId: number;
    name: string;
    cpfCnpj: string;
    email: string;
    phone: string | null;
    address: AddressView | null;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClientsRaw {
    id: number;
    company_id: number;
    name: string;
    cpf_cnpj: string;
    email: string;
    phone: string | null;
    address: AddressRaw | null;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export function processClient(raw: ClientsRaw): ClientsView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        name: raw.name,
        cpfCnpj: raw.cpf_cnpj,
        email: raw.email,
        phone: raw.phone,
        address: processAddress(raw.address),
        createdBy: raw.created_by,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as ClientsView;
}

export function buildRawClient(data: any): ClientsRaw {
    return {
        id: data.c_id,
        company_id: data.c_company_d,
        name: data.c_name,
        cpf_cnpj: data.c_cpf_cnpj,
        email: data.c_email,
        phone: data.c_phone,
        address: {
            cep: data.cep,
            state: data.state,
            city: data.city,
            street: data.street,
            district: data.district,
            number: data.number
        } as AddressRaw,
        created_by: data.c_created_by,
        created_at: data.c_created_at,
        updated_at: data.c_updated_at
    } as ClientsRaw
}

export function ClientsProperties() {
    return {
        required: [
            "name",
            "cpf_cnpj",
            "email"
        ],
        optional: [
            "phone",
            "address"
        ]
    }
}
