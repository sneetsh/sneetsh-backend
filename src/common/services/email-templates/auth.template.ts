import { SendMailDTO } from "src/common/validations"

export enum EmailTypes {
    WELCOME = 'welcome',
    INVITE = 'invite',
    ACTIVATE = 'activate',
    PASSWORD_RESET = 'password_reset',
    SCHOOL_SETUP = 'school_setup'
}

const commonTemplate = ({ content, subject }) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:20px}@media screen and (max-width: 480px) {.logo {max-width: 80px;}}.footer{margin-top:2em;background-color:#252729;color:#fff;text-align:center;padding:10px;font-size:small;font-family:Arial,Helvetica,sans-serif}.footer p{line-height:12px}.footer img{margin:1.5em auto}.logo{max-width:100px;height:auto;display:block;margin:0 auto}</style></head><body><h3>${subject}</h3> ${content}</body></html>`

const welcome = (payload: any) => {
    const subject = 'Welcome to Dafera';

    const content = `<p> Hello <strong>${payload.first_name} ${payload.last_name}</strong>, welcome to our Dafera</p><p>We are thrilled to have you on board!</p ><p>To activate your account, please click on the following link:</p><a href="${payload.link}">${payload.link}</a>`

    const html = commonTemplate({ subject, content });

    return { subject, html }
}

const activate = (data: any) => {
    const subject = 'Account Activation';

    const content = `<p> Hello <strong>${data.first_name} ${data.last_name}</strong>, welcome onboard.</p><p>We are thrilled to have you on board!</p ><p>Activate your account using: </p><p><strong>${data.token}</strong></p>`;

    const html = commonTemplate({ subject, content });

    return { subject, html }
}

const passwordRest = (data: any) => {
    const subject = 'Password Reset Request';

    const content = `<p>Hello ${data.first_name} ${data.last_name},</p><p>We received a request to reset your password.</p><p>To reset your password, please use the following token: <strong>${data.token}</strong></p><p>If you didn't request a password reset, you can ignore this email.</p>`;

    const html = commonTemplate({ subject, content });

    return { subject, html }
}

export const getTemplate = (payload: SendMailDTO): { subject: string, html: string } => {
    const { type, data } = payload;

    switch (type) {
        case EmailTypes.WELCOME:
            return welcome(data);

        case EmailTypes.ACTIVATE:
            return activate(data);

        case EmailTypes.PASSWORD_RESET:
            return passwordRest(data);

        default:
            break;
    }

}