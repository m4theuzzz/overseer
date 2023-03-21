import { Request, Response, Router } from 'express';
import { ExportsController } from '../controllers/ExportsController';
import { authMiddleware } from '../modules/Utils';

const route = Router();
const controller = new ExportsController();

route.post('/budget/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const html = await controller.exportClientBudget(
            Number(req.params.id), Number(req.headers.authorization), req.body.notes ?? ''
        );
        res.status(200).send(html);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = route;
