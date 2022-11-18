import * as aws from "aws-sdk";
import * as fs from "fs";
import { keys } from "lodash";
import * as nodemailer from "nodemailer";
import * as path from "path";
import { Constants } from "../config/constants";
import { Log } from "./logger";

export class SendEmail {

    public static sendRawMail = (
        template: string = null, replaceData: Json = null, email: string[], subject: string, text: string = 'T. Gargour & Fils',
    ) => {

        let html = "";
        if (template) {
            // send email for verification
            const templatesDir = path.resolve(`${__dirname}/../`, "templates");
            const content = `${templatesDir}/${template}.html`;
            html = SendEmail.getHtmlContent(content, replaceData);
        }

        const mailOptions = {
            from: process.env.DEFAULT_FROM,
            html,
            replyTo: process.env.DEFAULT_REPLY_TO,
            subject,
            to: email,
            text,
        };

        let transportObj = {};

        transportObj = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER_NAME,
                pass: process.env.SMTP_PASSWORD,
            },
        };
        const transporter = nodemailer.createTransport(transportObj);


        transporter.sendMail(mailOptions, (mailSendErr: any, info: any) => {
            if (!mailSendErr) {
                SendEmail.logger.info(`Message sent: ${info.response}`);
            } else {
                SendEmail.logger.error(`Error in sending email: ${mailSendErr} and info ${info}`);
            }
        });
    }

    private static logger: any = Log.getLogger();

    // Just reading html file and then returns in string
    public static getHtmlContent = (filePath: string, replaceData: any) => {
        const data = fs.readFileSync(filePath);
        let html = data.toString();
        keys(replaceData).forEach((key) => {
            html = html.replace(key, replaceData[key]);
        });
        return html;
    }
}
