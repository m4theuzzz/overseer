import { Security } from '../modules/Security';
import { UserView } from '../types/UserView';
import { Database } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';

export class UserController {
    getUsers = async () => {
        try {
            const query = "SELECT * FROM Users";

            return await Database.execute(query) as UserView[];
        } catch (e) {
            const error: RequestException = {
                status: 400,
                message: e.message
            }

            throw error;
        }
    }

    createUser = async (name: string, password: string, email: string) => {
        try {
            const query = `INSERT INTO Users(name, password, email) VALUES ("${escape(name)}", "${Security.encrypt(password)}", "${escape(email)}")`;

            return await Database.execute(query);
        } catch (e) {
            const error: RequestException = {
                status: 400,
                message: e.message
            }

            throw error;
        }
    }
}