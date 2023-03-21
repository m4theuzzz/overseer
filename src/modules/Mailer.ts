import * as mailer from 'nodemailer';
import { Email } from '../types/EmailView';

export class Mailer {
    transporter: any = null;

    constructor() {
        this.transporter = this.buildTransporter();
    }

    private buildTransporter = () => {
        const smtpPort = process.env.ENV === 'production' ? 465 : 587;
        return mailer.createTransport({
            pool: true,
            host: process.env.SMTP,
            port: smtpPort,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_EMAIL_PASS
            }
        });
    }

    sendMessage = async (emailInfo: Email) => {
        return await this.transporter.sendMail({
            from: emailInfo.from ? emailInfo.from : `"Overseer" <${process.env.EMAIL}>`,
            to: `${emailInfo.to}`,
            subject: emailInfo.subject,
            text: emailInfo.text ?? null,
            html: emailInfo.html ?? null
        }, (err: any, info: any) => {
            if (err) {
                console.log(err);
                return err;
            }

            return info;
        });
    }
}
