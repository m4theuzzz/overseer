export interface UsersView {
    id: string;
    name: string;
    password: string;
    email: string;
    cnpj: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}