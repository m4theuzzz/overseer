import { NextFunction, Request, Response, Router, urlencoded } from 'express';
import { AuthController } from '../controllers/AuthController';

const route = Router();
const controller = new AuthController();

route.post('/login', urlencoded({ extended: false }), (req: Request, res: Response, next: NextFunction) => {
    req.session.regenerate(async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send("Não foi possível iniciar a sessão");
        }

        if (!req.body.email || !req.body.password) {
            return res.status(400).send("Requisição não possui os dados necessários");
        }

        try {
            const sessionToken = await controller.authorize(req.body.email, req.body.password);

            req.session.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Não foi possível iniciar a sessão");
                } else {
                    res.status(200).send(sessionToken);
                }
            })
        } catch (error) {
            res.status(error.status).send(error.message);
        }
    });
});

module.exports = route;