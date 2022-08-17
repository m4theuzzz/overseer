import { Database } from '../modules/Database';
import { UsersView } from '../types/UsersView';
import { Security } from '../modules/Security';
import { RequestException } from '../types/RequestExceptionView';


export class AuthController {
    authorize = async (email: string, password: string) => {
        const query = "SELECT * FROM Users";
        const params = {
            email: email
        };

        const users = (await Database.execute(query, params)) as UsersView[];
        const user = users[0];

        if (!user) {
            throw { status: 404, message: "Email não cadastrado." } as RequestException;
        }

        if (Security.AESDecrypt(user.password) == password) {
            return { "session-token": Security.JWTEncrypt(user) };
        } else {
            throw { status: 400, message: "Senha incorreta." } as RequestException;
        }
    }

    authenticate = async (sessionToken: string | string[]) => {
        try {
            const userData = Security.JWTDecrypt(sessionToken as string);

            if (this.tokenIsValid(userData)) {
                await this.authorize(userData.email, Security.AESDecrypt(userData.password));
                return userData.id
            }
        } catch (error) {
            throw error;
        }
    }

    private tokenIsValid = (userData: any) => {
        if (
            !userData.expireAt ||
            !userData.email ||
            !userData.password ||
            !userData.id
        ) {
            throw { status: 403, message: "Token inválido." } as RequestException;
        }

        const now = new Date();
        if (now > userData.expireAt) {
            throw { status: 403, message: "Token expirado." } as RequestException;
        }

        return true;
    }
}