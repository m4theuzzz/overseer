import { NextFunction, Request, Response, Router } from 'express';
import { ClientsController } from '../controllers/ClientsController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';
import { processClient } from '../types/ClientsView';

const route = Router();
const controller = new ClientsController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    if (verifyIntegrity('Clients', req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        if (req.body.address && !verifyIntegrity('Address', req.body.address)) {
            res.status(400).send('Corpo de endereço inválido.');
        }
        const client = await controller.createClient(Number(req.sessionID), Number(req.headers.authorization), processClient(req.body));
        res.status(200).send("Cliente criado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await controller.getClients(Number(req.headers.authorization));
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.getClientById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const client = await controller.updateClient(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Cliente atualizado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.deleteClient(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Cliente removido com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
