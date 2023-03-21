import { NextFunction, Request, Response, Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { verifyIntegrity, authMiddleware, hasEnoughtHierarchy } from '../modules/Utils';

const route = Router();
const controller = new UsersController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    if (verifyIntegrity('Users', req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.get('/', async (req: Request, res: Response) => {
    try {
        const users = await controller.getUsers(Number(req.headers.authorization));
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: any, res: Response) => {
    try {
        const user = await controller.getUser(req.headers.authorization, req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const response: any = await controller.createUser(Number(req.headers.authorization), req.body);
        if (response.affectedRows > 0) {
            res.status(200).send("Usuário cadastrado com sucesso.");
        } else {
            res.status(400).send("Não foi possível cadastrar o usuário.");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: any, res: Response) => {
    try {
        if (!(await hasEnoughtHierarchy(req.headers.authorization, req.sessionID, req.params.id))) {
            return res.status(401).send("Você não possui permissão para alterar este usuário.");
        }
        await controller.updateUser(req.headers.authorization, req.params.id, req.body);
        res.status(200).send("Usuário atualizado com sucesso.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: any, res: Response) => {
    try {
        if (!(await hasEnoughtHierarchy(req.headers.authorization, req.sessionID, req.params.id))) {
            return res.status(401).send("Você não possui permissão para alterar este usuário.");
        }
        await controller.deleteUser(req.headers.authorization, req.params.id);
        res.status(200).send("Usuário deletado com sucesso.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
