import { NextFunction, Request, Response } from 'express';
import { BudgetsProperties } from "../types/BudgetsView";
import { ClientsProperties } from "../types/ClientsView";
import { ConstructionsProperties } from "../types/ConstructionsView";
import { ServicesProperties } from "../types/ServicesView";
import { TransactionsProperties } from "../types/TransactionsView";
import { UsersProperties } from "../types/UsersView";
import { AuthController } from '../controllers/AuthController';
import { CompanyProperties } from '../types/CompanyView';
import { BudgetServicesProperties } from '../types/BudgetServicesView';
import { AddressProperties } from '../types/AddressView';
import { RequestException } from '../types/RequestExceptionView';
import { UsersController } from '../controllers/UsersController';

const auth = new AuthController();

const viewProperties: any = {
    Address: AddressProperties(),
    Budgets: BudgetsProperties(),
    BudgetServices: BudgetServicesProperties(),
    Clients: ClientsProperties(),
    Constructions: ConstructionsProperties(),
    Company: CompanyProperties(),
    Services: ServicesProperties(),
    Transactions: TransactionsProperties(),
    Users: UsersProperties(),
}

export function verifyIntegrity(viewName: string, receivedProperties: any): boolean {
    const view = viewProperties[viewName];

    if (!view) {
        return false;
    }

    let requiredCounter = 0;
    let optionalCounter = 0;
    for (const key in receivedProperties) {
        if (view.required.indexOf(key) > -1) {
            requiredCounter++;
            continue;
        }

        if (view.optional.indexOf(key) > -1) {
            optionalCounter++;
        }
    }

    if (
        requiredCounter !== view.required.length ||
        (requiredCounter + optionalCounter) !== Object.keys(receivedProperties).length
    ) {
        return false;
    }

    return true;
}

export function escape(string: any): string {
    if (typeof string !== "string") {
        return string;
    }
    string = string.replace('"', '\\"');
    string = string.replace("\'", "\\'");
    string = string.replace('`', '\\`');
    return string;
}

function isSoftRoute(path: string, method: string): boolean {
    if (
        (path.indexOf('/transactions') !== -1 && method === 'POST') ||
        (path.indexOf('/budgets') !== -1 && method === 'GET') ||
        (path.indexOf('/services') !== -1 && method === 'GET')
    ) {
        return true;
    }

    return false;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.headers["session-token"]) {
        try {
            const sessionToken = req.headers['session-token'];
            const { userId, companyId, permissionLevel } = await auth.authenticate(sessionToken);

            if (!isSoftRoute(req.baseUrl, req.method)) {
                if (permissionLevel < 7) {
                    throw { status: 401, message: "Você não possui permissão para realizar esta operação." } as RequestException;
                }
            }

            req.headers.authorization = String(companyId);
            req.sessionID = String(userId);
            next();
        } catch (error) {
            console.log(error);
            res.status(403).send("Token Inválido.");
        }
    } else {
        res.status(403).send("Token de autenticação não recebido.");
    }
}

export async function hasEnoughtHierarchy(companyId: number, requesterId: number, targetId: number): Promise<boolean> {
    if (requesterId == targetId) {
        return true;
    }

    const user = new UsersController();
    const requester = await user.getUser(companyId, requesterId);
    const target = await user.getUser(companyId, targetId);

    if (requester.level > target.level) {
        return true;
    } else {
        return false;
    }
}
