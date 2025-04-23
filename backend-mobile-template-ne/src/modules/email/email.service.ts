import path from "path";
import { SingletonFactory } from "../../core/utils/singleton.util";
import { logger } from "../../core/config/logger";
import pug from "pug"
import { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER } from "../../core/config/env";
import nodemailer, { Transporter } from "nodemailer";

class EmailService extends SingletonFactory<EmailService>() {
    private transporter: Transporter

    private constructor(){
        super()
        this.transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        })
    }

    async sendEmail(to: string, subject: string, templateName: string, templateData: Record<string, any>){
        const templatePath = path.join(__dirname, "../../core/templates", `${templateName}.pug`)

        try {
            const html = pug.renderFile(templatePath, templateData)

            const mailOptions = {
                from: EMAIL_USER,
                to, 
                subject,
                html
            }

            const info = await this.transporter.sendMail(mailOptions)
            logger.info(`Email sent to the user : ${info.response}`)
        } catch(error){
            logger.error("Error sending the email", error)
        }
    }
}

export const emailService = EmailService.getInstance()