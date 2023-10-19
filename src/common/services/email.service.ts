import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getTemplate, } from './email-templates/auth.template';
import { SendMailDTO } from '../validations';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: true,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            },
        });
    }

    async sendEmail(payload: SendMailDTO) {
        const { data } = payload;
        Logger.debug(JSON.stringify(data))

        const template = getTemplate(payload);
        const { subject, html } = template;

        try {
            const mailOptions: nodemailer.SendMailOptions = {
                from: this.configService.get('EMAIL_USER'),
                to: data.email,
                subject,
                html
            };

            // await this.transporter.sendMail(mailOptions);

            Logger.debug('Email sent successfully.');
        } catch (error) {
            Logger.error('Error sending email.');
            throw error;
        }
    }
}
