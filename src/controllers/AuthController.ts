import { execute } from '../modules/Database';
import { processUser, UsersView } from '../types/UsersView';
import { Security } from '../modules/Security';
import { RequestException } from '../types/RequestExceptionView';
import { AccessView } from '../types/AccessView';

export class AuthController {
    authorize = async (email: string, password: string) => {
        const query = `SELECT * FROM Users WHERE email="${email}"`;

        const user = (await execute(query) as any[])[0];

        if (!user) {
            throw { status: 404, message: "Email não cadastrado." } as RequestException;
        }

        const userView = processUser(user);

        if (Security.AESDecrypt(user.password) == password) {
            return {
                "user": {
                    "id": userView.id,
                    "name": userView.name,
                    "email": userView.email,
                    "permissionLevel": userView.level,
                    "profilePicture": userView.profileImage
                },
                "session-token": Security.JWTEncrypt(userView)
            };
        } else {
            throw { status: 400, message: "Senha incorreta." } as RequestException;
        }
    }

    authenticate = async (sessionToken: string | string[]): Promise<AccessView> => {
        try {
            const userData = Security.JWTDecrypt(sessionToken as string);

            if (this.tokenIsValid(userData)) {
                await this.authorize(userData.email, Security.AESDecrypt(userData.password));
                return { userId: userData.userId, companyId: userData.companyId, permissionLevel: userData.level } as AccessView;
            }
        } catch (error) {
            throw error;
        }
    }

    private tokenIsValid = (userData: any): boolean => {
        if (
            !userData.expireAt ||
            !userData.email ||
            !userData.password ||
            !userData.userId ||
            !userData.companyId ||
            !userData.level
        ) {
            throw { status: 403, message: "Token inválido." } as RequestException;
        }

        const now = new Date();

        if (now > new Date(userData.expireAt)) {
            throw { status: 403, message: "Token expirado." } as RequestException;
        }

        return true;
    }
}
