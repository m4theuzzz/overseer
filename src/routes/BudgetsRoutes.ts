import { NextFunction, Request, Response, Router } from 'express';
import { BudgetsController } from '../controllers/BudgetsController';
import { verifyIntegrity, authMiddleware } from '../modules/Utils';
import { processBudgetService } from '../types/BudgetServicesView';
import { processBudget } from '../types/BudgetsView';

const route = Router();
const controller = new BudgetsController();

const verifyBodyIntegrity = (req: Request, res: Response, next: NextFunction) => {
    let service = 'Budgets';
    if (req.url.indexOf("services") > -1) {
        service = 'BudgetServices';
    }

    if (verifyIntegrity(service, req.body)) {
        next();
    } else {
        return res.status(400).send('Corpo da requisição inválido.');
    }
}

route.use(authMiddleware);

route.post('/', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const budget = await controller.createBudget(Number(req.sessionID), Number(req.headers.authorization), processBudget(req.body));
        res.status(200).send("Orçamento inserido com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.post('/:id/services', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const budget = await controller.createBudgetService(Number(req.headers.authorization), Number(req.params.id), processBudgetService(req.body));
        res.status(200).send("Serviço inserido no orçamento com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const budget = await controller.getBudgets(Number(req.headers.authorization));
        res.status(200).send(budget);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const budget = await controller.getBudgetById(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(budget);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id/services/costs', async (req: Request, res: Response) => {
    try {
        const budgetServicesCosts = await controller.getBudgetServicesCosts(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(budgetServicesCosts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id/services', async (req: Request, res: Response) => {
    try {
        const budget = await controller.getBudgetServices(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(budget);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.get('/:id/transactions', async (req: Request, res: Response) => {
    try {
        const budget = await controller.getBudgetTransactions(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send(budget);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:id', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const budget = await controller.updateBudget(Number(req.params.id), req.body, Number(req.headers.authorization));
        res.status(200).send("Orçamento atualizado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.put('/:budgetId/services/:budgetServiceId', verifyBodyIntegrity, async (req: Request, res: Response) => {
    try {
        const budget = await controller.updateBudgetService(Number(req.params.budgetServiceId), Number(req.headers.authorization), req.body);
        res.status(200).send("Orçamento atualizado com sucesso");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:id', async (req: Request, res: Response) => {
    try {
        const budget = await controller.deleteBudget(Number(req.params.id), Number(req.headers.authorization));
        res.status(200).send("Orçamento removido com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

route.delete('/:budgetId/services/:budgetServiceId', async (req: Request, res: Response) => {
    try {
        const budget = await controller.deleteBudgetService(Number(req.params.budgetServiceId), Number(req.headers.authorization));
        res.status(200).send("Orçamento removido com sucesso,");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = route;
