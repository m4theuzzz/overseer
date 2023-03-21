import { AddressRaw, AddressView, processAddress } from "./AddressView";

export interface ConstructionsView {
    id: number;
    clientId: number;
    companyId: number;
    name: string;
    address: AddressView;
    incomingMargin: number;
    teams: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ConstructionsRaw {
    id: number;
    client_id: number;
    company_id: number;
    name: string;
    address: AddressRaw;
    incoming_margin: number;
    teams: number;
    created_at: Date;
    updated_at: Date;
}

export function processConstruction(raw: ConstructionsRaw): ConstructionsView {
    return {
        id: raw.id,
        clientId: raw.client_id,
        companyId: raw.company_id,
        name: raw.name,
        address: processAddress(raw.address),
        incomingMargin: raw.incoming_margin / 100,
        teams: raw.teams,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as ConstructionsView;
}

export function buildRawConstruction(data: any): ConstructionsRaw {
    return {
        id: data.c_id,
        client_id: data.c_client_id,
        company_id: data.c_company_id,
        name: data.c_name,
        address: {
            cep: data.cep,
            state: data.state,
            city: data.city,
            street: data.street,
            district: data.district,
            number: data.number
        } as AddressRaw,
        incoming_margin: data.c_incoming_margin,
        teams: data.c_teams,
        created_at: data.c_created_at,
        updated_at: data.c_updated_at,
    } as ConstructionsRaw;
}

export function ConstructionsProperties() {
    return {
        required: [
            "client_id",
            "name",
            "address"
        ],
        optional: [
            "incoming_margin",
            "teams"
        ]
    }
}
