import { Application } from 'express';
import { Database } from '../modules/Database';
import { UserView } from '../types/UserView';
import { Security } from '../modules/Security';
import { RequestException } from '../types/RequestExceptionView';


export class AuthController {
    authenticate = async (email: string, password: string): Promise<string> => {
        const query = "SELECT * FROM Users";
        const params = {
            email: email
        };

        const users = (await Database.execute(query, params)) as UserView[];
        const user = users[0];

        if (!user) {
            throw { status: 404, message: "Email não cadastrado." } as RequestException;
        }

        if (Security.decrypt(user.password) == password) {
            return user.id;
        } else {
            throw { status: 400, message: "Senha incorreta." } as RequestException;
        }
    }
}