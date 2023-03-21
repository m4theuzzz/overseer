import { Request, Response, Router, urlencoded } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Security } from '../modules/Security';

const route = Router();
const controller = new AuthController();

route.post('/login', urlencoded({ extended: false }), (req: Request, res: Response) => {
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
            res.status(error.status || 500).send(error.message);
        }
    });
});

route.post('/refresh', urlencoded({ extended: false }), async (req: Request, res: Response) => {
    if (!req.headers['session-token']) {
        return res.status(400).send("Token de autenticação não recebido.");
    }

    try {
        await controller.authenticate(req.headers['session-token']);
        const userData = Security.JWTDecrypt(req.headers['session-token'] as string);
        res.status(200).send(await controller.authorize(userData.email, Security.AESDecrypt(userData.password)));
    } catch (error) {
        res.status(error.status ?? 500).send(error.message);
    }
})

module.exports = route;
