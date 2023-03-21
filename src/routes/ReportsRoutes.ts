import { Request, Response, Router } from 'express';
import { ReportsController } from '../controllers/ReportsController';
import { authMiddleware } from '../modules/Utils';

const route = Router();
const controller = new ReportsController();

route.use(authMiddleware);

route.get('/constructionsDurationAverage', async (req: Request, res: Response) => {
    const response = await controller.getConstructionDurationAverage(Number(req.headers.authorization));
    res.status(200).send(response);
});

route.get('/transactionsReport', async (req: Request, res: Response) => {
    const response = await controller.getTransactionReport(Number(req.headers.authorization));
    res.status(200).send(response);
});

route.get('/transactionsReportByMonth', async (req: Request, res: Response) => {
    const response = await controller.getTransactionsReportByMonth(Number(req.headers.authorization));
    res.status(200).send(response);
});

route.get('/budgetsByMonth', async (req: Request, res: Response) => {
    const response = await controller.getIntByMonths(Number(req.headers.authorization), 'Budgets');
    res.status(200).send(response);
});

route.get('/budgetsReport', async (req: Request, res: Response) => {
    const response = await controller.getBudgetsReport(Number(req.headers.authorization));
    res.status(200).send(response);
});

route.get('/clientsByMonth', async (req: Request, res: Response) => {
    const response = await controller.getIntByMonths(Number(req.headers.authorization), 'Clients');
    res.status(200).send(response);
});

route.get('/incomingMargin', async (req: Request, res: Response) => {
    const response = await controller.getIncomingMargin(Number(req.headers.authorization));
    res.status(200).send(response);
});

module.exports = route;