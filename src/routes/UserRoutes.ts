import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';

const route = Router();
const controller = new UserController();

route.use((req: any, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send("Sua sessão expirou.");
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
        const user = await controller.getUser(req.session.user);
        res.status(200).send(user);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.post('/', async (req: Request, res: Response) => {
    try {
        const response: any = await controller.createUser(req.body.name, req.body.password, req.body.email);
        if (response.affectedRows > 0) {
            res.status(200).send("Usuário cadastrado com sucesso!");
        } else {
            res.status(400).send("Não foi possível cadastrar o usuário.");
        }

    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

module.exports = route;