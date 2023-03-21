import { NextFunction, Request, Response, Router } from 'express';
import { TransactionsController } from '../controllers/TransactionsController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';
import { processTransaction } from '../types/TransactionsView';

const route = Router();
const controller = new TransactionsController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    let service = 'Transactions';
    if (verifyIntegrity(service, req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const transaction = await controller.createTransaction(Number(req.sessionID), Number(req.headers.authorization), processTransaction(req.body));
        res.status(200).send("Transação inserida com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const transaction = await controller.getTransactions(Number(req.headers.authorization));
        res.status(200).send(transaction);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const transaction = await controller.getTransactionById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(transaction);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const transaction = await controller.updateTransaction(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Transação atualizada com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const transaction = await controller.deleteTransaction(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Transação removida com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
