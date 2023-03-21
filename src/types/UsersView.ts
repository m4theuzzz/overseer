export interface UsersView {
    id: number;
    companyId: number;
    name: string;
    password: string;
    email: string;
    level: number;
    phone: string | null;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UsersRaw {
    id: number;
    company_id: number;
    name: string;
    password: string;
    email: string;
    level: number;
    phone: string | null;
    profile_image: string;
    created_at: Date;
    updated_at: Date;
}

export function processUser(raw: UsersRaw): UsersView {
    return {
        id: raw.id,
        companyId: raw.company_id,
        name: raw.name,
        password: raw.password,
        email: raw.email,
        level: raw.level,
        phone: raw.phone,
        profileImage: raw.profile_image,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    } as UsersView;
}

export function UsersProperties() {
    return {
        required: [
            "name",
            "email"
        ],
        optional: [
            "password",
            "phone",
            "level",
            "profile_image"
        ]
    }
}
