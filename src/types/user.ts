export interface User {
    id: string;
    name: string;
    password: string;
    email: string;
    sessionId?: string;
    createdAt: Date;
    updatedAt: Date;
}