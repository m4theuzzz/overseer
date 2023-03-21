import { NextFunction, Request, Response, Router } from 'express';
import { MailerController } from '../controllers/MailerController';

const route = Router();
const controller = new MailerController();

const validateEmailInfo = (req: Request, res: Response, next: NextFunction) => {
    const emailInfo = req.body;

    if (
        emailInfo.hasOwnProperty('to') &&
        emailInfo.hasOwnProperty('subject') &&
        (emailInfo.hasOwnProperty('text') || emailInfo.hasOwnProperty('html'))
    ) {
        next();
    } else {
        res.status(400).send('Objeto de email inválido');
    }
}

route.post('/sendEmail', validateEmailInfo, async (req: Request, res: Response) => {
    return res.status(200).send(await controller.sendEmail(req.body));
});

module.exports = route;
