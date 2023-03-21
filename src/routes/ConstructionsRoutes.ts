import { NextFunction, Request, Response, Router } from 'express';
import { ConstructionsController } from '../controllers/ConstructionsController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';
import { processConstruction } from '../types/ConstructionsView'

const route = Router();
const controller = new ConstructionsController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    if (verifyIntegrity('Constructions', req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        if (!verifyIntegrity('Address', req.body.address)) {
            res.status(400).send('Corpo de endereço inválido.');
        }
        const constructions = await controller.createConstruction(Number(req.sessionID), Number(req.headers.authorization), processConstruction(req.body));
        res.status(200).send("Obra criada com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const constructions = await controller.getConstructions(Number(req.headers.authorization));
        res.status(200).send(constructions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const constructions = await controller.getConstructionById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(constructions);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const constructions = await controller.updateConstruction(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Obra atualizada com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const constructions = await controller.deleteConstruction(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Obra removida com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
