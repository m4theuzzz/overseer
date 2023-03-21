import { Security } from '../modules/Security';
import { processUser, UsersRaw, UsersView } from '../types/UsersView';
import { execute } from '../modules/Database';
import { RequestException } from '../types/RequestExceptionView';
import { escape } from '../modules/Utils';

export class UsersController {
    createUser = async (companyId: number, info: UsersView) => {
        try {
            if (!info.password) {
                throw {
                    status: 400,
                    message: "É necessário a senha para cadastro."
                } as RequestException;
            }

            const query = `
                INSERT INTO Users(company_id, name, password, email, phone, level)
                VALUES (
                    "${companyId}",
                    "${escape(info.name)}",
                    "${Security.AESEncrypt(info.password)}",
                    "${escape(info.email)}",
                    ${info.phone ? '"' + escape(info.phone) + '"' : null},
                    "${info.level ? info.level : 7}"
                    )
            `;

            return await execute(query);
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    // ADM ONLY
    getUsers = async (companyId: number): Promise<UsersView[]> => {
        try {
            const query = `SELECT * FROM Users WHERE company_id="${companyId}"`;

            const users = await execute(query) as UsersRaw[];
            return this.filterUserResponseObject(users.map(user => processUser(user)));
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    getUser = async (companyId: number, id: number): Promise<UsersView> => {
        try {
            const query = `SELECT * FROM Users WHERE id = "${id}" AND company_id = "${companyId}"`;

            const user = (await execute(query) as any[])[0];

            return this.filterUserResponseObject([user])[0];
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    updateUser = async (companyId: number, userId: number, user: any) => {
        try {
            let query = `UPDATE Users SET `;
            let i = 0;
            for (let key in user) {
                query += user[key] ? `${key} = "${escape(user[key])}"` : `${key} = ${user[key]}`;

                if (i == (Object.keys(user).length - 1)) {
                    query += " ";
                    continue;
                }
                query += ", ";
                i++;
            }
            query += `WHERE id = "${userId}" AND company_id = "${companyId}"`;

            return await execute(query, { id: userId });
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    deleteUser = async (companyId: number, id: number) => {
        try {
            const query = `DELETE FROM Users WHERE id = "${id}" AND company_id = "${companyId}"`;

            return await execute(query);
        } catch (e) {
            throw {
                status: 500,
                message: e.message
            } as RequestException;
        }
    }

    private filterUserResponseObject = (users: UsersView[]) => {
        const filteredUsers = users.map(user => {
            delete user.password;
            return user;
        });
        return filteredUsers;
    }
}
