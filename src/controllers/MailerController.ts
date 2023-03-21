import { Email } from "../types/EmailView";
import { Mailer } from "../modules/Mailer";

const { sendMessage } = new Mailer();

export class MailerController {
    sendEmail = async (info: Email) => {
        return await sendMessage(info);
    }
}
