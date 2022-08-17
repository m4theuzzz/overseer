import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ClientsController } from '../controllers/ClientsController';

const route = Router();
const controller = new ClientsController();
const auth = new AuthController();

const verifyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    const clientsViewFields = [
        "name",
        "cpf_cnpj",
        "email",
        "phone",
        "address"
    ];
    const client = req.body;

    if (Object.keys(client).length !== 5) {
        return res.status(400).send('Corpo da requisição inválido.');
    }

    let isValid = true;
    for (const key in client) {
        if (clientsViewFields.indexOf(key) > -1) {
            continue;
        }

        isValid = false;
    }

    if (isValid) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }

}

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

route.post('/', verifyIntegrity, async (req: Request, res: Response) => {
    try {
        const client = await controller.createClient(req.sessionID, req.body);
        res.status(200).send("Cliente criado com sucesso");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await controller.getClients();
        res.status(200).send(clients);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.getClientById(req.params.id);
        res.status(200).send(client);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.put('/:id', verifyIntegrity, async (req: Request, res: Response) => {
    try {
        const client = await controller.updateClient(req.params.id, req.body);
        res.status(200).send("Cliente atualizado com sucesso");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.deleteClient(req.params.id);
        res.status(200).send("Cliente removido com sucesso,");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

module.exports = route;