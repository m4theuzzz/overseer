export interface ClientsView {
    id: string;
    user_id: string;
    name: string;
    cpf_cnpj: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: Date;
    updated_at: Date;
}