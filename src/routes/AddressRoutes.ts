import { NextFunction, Request, Response, Router } from 'express';
import { AddressController } from '../controllers/AddressController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';
import { AddressRaw, processAddress } from '../types/AddressView';

const route = Router();
const controller = new AddressController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    if (verifyIntegrity('Address', req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const client = await controller.createAddress(Number(req.headers.authorization), processAddress(req.body as AddressRaw));
        res.status(200).send("Endereço criado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await controller.getAddress(Number(req.headers.authorization));
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.getAddressById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const client = await controller.updateAddress(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Endereço atualizado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const client = await controller.deleteAddress(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Endereço removido com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
