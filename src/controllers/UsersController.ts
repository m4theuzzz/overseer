import { Security } from '../modules/Security';
import { UsersView } from '../types/UsersView';
import { Database } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';

export class UsersController {
    createUser = async (name: string, password: string, email: string) => {
        try {
            const query = `INSERT INTO Users(name, password, email) VALUES ("${escape(name)}", "${Security.AESEncrypt(password)}", "${escape(email)}")`;

            return await Database.execute(query);
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    // DEV ONLY: DELETE ON PRODUCTION
    getUsers = async (): Promise<UsersView[]> => {
        try {
            const query = "SELECT * FROM Users";

            return await Database.execute(query) as UsersView[];
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getUser = async (id: string): Promise<UsersView> => {
        try {
            const query = "SELECT * FROM Users";

            const user = (await Database.execute(query, { id: id }) as any[])[0];

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            } as UsersView;
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    updateUser = async (user: UsersView) => {
        try {
            const query = `UPDATE Users SET name = "${user.name}", email = "${user.email}"`;

            return await Database.execute(query, { id: user.id });
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteUser = async (id: string) => {
        try {
            const query = `DELETE FROM Users WHERE id = "${id}"`;

            return await Database.execute(query);
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }
}