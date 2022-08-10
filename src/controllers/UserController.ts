import { Security } from '../modules/Security';
import { UserView } from '../types/UserView';
import { Database } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';

export class UserController {
    createUser = async (name: string, password: string, email: string) => {
        try {
            const query = `INSERT INTO Users(name, password, email) VALUES ("${escape(name)}", "${Security.AESEncrypt(password)}", "${escape(email)}")`;

            return await Database.execute(query);
        } catch (e) {
            const error: RequestException = {
                status: 500,
                message: e.message
            }

            throw error;
        }
    }

    // DEV ONLY: DELETE ON PRODUCTION
    getUsers = async (): Promise<UserView[]> => {
        try {
            const query = "SELECT * FROM Users";

            return await Database.execute(query) as UserView[];
        } catch (e) {
            const error: RequestException = {
                status: 500,
                message: e.message
            }

            throw error;
        }
    }

    getUser = async (id: string): Promise<UserView> => {
        try {
            const query = "SELECT * FROM Users";

            return (await Database.execute(query, { id: id }) as UserView[])[0];
        } catch (e) {
            const error: RequestException = {
                status: 500,
                message: e.message
            }

            throw error;
        }
    }

    updateUser = async (user: UserView) => {
        try {
            const query = `UPDATE Users SET name = ${user.name}, email = ${user.email}`;

            return await Database.execute(query, { id: user.id });
        } catch (e) {
            const error: RequestException = {
                status: 500,
                message: e.message
            }

            throw error;
        }
    }

    deleteUser = async (id: string) => {
        try {
            const query = `DELETE FROM Users`;

            return await Database.execute(query, { id: id });
        } catch (e) {
            const error: RequestException = {
                status: 500,
                message: e.message
            }

            throw error;
        }
    }
}