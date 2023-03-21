import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ServicesController } from '../controllers/ServicesController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';

const route = Router();
const controller = new ServicesController();
const auth = new AuthController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    if (verifyIntegrity('Services', req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const service = await controller.createService(Number(req.sessionID), Number(req.headers.authorization), req.body);
        res.status(200).send("Serviço criado com sucesso");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const service = await controller.getServices(Number(req.headers.authorization));
        res.status(200).send(service);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const service = await controller.getServiceById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(service);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const service = await controller.updateService(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Serviço atualizado com sucesso");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const service = await controller.deleteService(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Serviço removido com sucesso,");
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});

module.exports = route;
