import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { UserView } from '../types/UserView';

const route = Router();
const controller = new UserController();
const auth = new AuthController();

route.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["session-token"]) {
        try {
            const sessionToken = req.headers['session-token'];
            const sessionId = await auth.authenticate(sessionToken);
            req.sessionID = sessionId;
            next();
        } catch (error) {
            console.log(error);
            res.status(403).send("Token Inválido.");
        }
    } else {
        res.status(403).send("Token de autenticação não recebido.");
    }
});

// DEV ONLY: DELETE ON PRODUCTION
route.get('/all', async (req: Request, res: Response) => {
    try {
        const users = await controller.getUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.get('/', async (req: any, res: Response) => {
    try {
        const user = await controller.getUser(req.sessionID);
        res.status(200).send(user);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.post('/', async (req: Request, res: Response) => {
    try {
        const response: any = await controller.createUser(req.body.name, req.body.password, req.body.email);
        if (response.affectedRows > 0) {
            res.status(200).send("Usuário cadastrado com sucesso.");
        } else {
            res.status(400).send("Não foi possível cadastrar o usuário.");
        }
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.put('/', async (req: any, res: Response) => {
    try {
        if (!req.body.email || !req.body.name) {
            return res.status(400).send("Sem dados suficientes.");
        }
        const userObject = {
            id: req.sessionID,
            name: req.body.name,
            email: req.body.email
        } as UserView;

        await controller.updateUser(userObject);
        res.status(200).send("Usuário atualizado com sucesso.");

    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.delete('/', async (req: any, res: Response) => {
    try {
        await controller.deleteUser(req.sessionID);
        res.status(200).send("Usuário deletado com sucesso.");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

module.exports = route;