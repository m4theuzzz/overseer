import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';

const route = Router();
const controller = new UserController();

route.use((req: any, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next();
    } else {
        res.status(440).send("Sessão Expirada");
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const users = await controller.getUsers();
        res.status(200).send(users);
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