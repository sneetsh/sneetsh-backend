import { SendMailDTO } from "src/common/validations"

export enum EmailTypes {
    WELCOME = 'welcome',
    INVITE = 'invite',
    ACTIVATE = 'activate',
    PASSWORD_RESET = 'password_reset',
    SCHOOL_SETUP = 'school_setup'
}

const commonTemplate = ({ content, subject }) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;padding:20px}@media screen and (max-width: 480px) {.logo {max-width: 80px;}}.footer{margin-top:2em;background-color:#252729;color:#fff;text-align:center;padding:10px;font-size:small;font-family:Arial,Helvetica,sans-serif}.footer p{line-height:12px}.footer img{margin:1.5em auto}.logo{max-width:100px;height:auto;display:block;margin:0 auto}</style></head><body><h3>${subject}</h3> ${content}<div class="footer"><img src="https://res.cloudinary.com/dxc14rkub/image/upload/v1694261654/Dafera_logo_PNG_horizontal_h7a8t4.png" alt="Company Logo" class="logo"><p>Contact Information:</p><p>Email: info@dafera.tech</p><p>Phone: +234 706 168 1517</p><p>&copy; Dafera International</p></div></body></html>`

const welcome = (payload: any) => {
    const subject = 'Welcome to Dafera';

    const content = `<p> Hello <strong>${payload.first_name} ${payload.last_name}</strong>, welcome to our Dafera</p><p>We are thrilled to have you on board!</p ><p>To activate your account, please click on the following link:</p><a href="${payload.link}">${payload.link}</a>`

    const html = commonTemplate({ subject, content });

    return { subject, html }
}

const invite = (data: any) => {
    const subject = 'Account Setup';

    const content = `<p>Hello <strong>${data.email}</strong>,</p><p>You have been invited to join your school workspace.</p><p>Setup your profile using the link:</p><a href="${data.link}">${data.link}</a>`;

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

const schoolSetup = (data: any) => {
    const subject = 'Complete School Signup Process';

    const content = `
        <div class="content">
            <p>Dear ${data.name},</p>
            <p>We are excited to welcome you to our platform, and we would like to assist you in completing the signup process.</p>
            <p>To get started, please follow these steps:</p>
            <ol><li>Go to our website: <a href="${data.link}">Complete Profile Setup</a></li><li>Enter school information to complete school profile.</li></ol>
            <p>Use the below credentials to login into the platform at a later time</p>
            <p>Email: ${data.email}<br>Password: <strong>${data.password}</strong></p>
            <p>Please make sure to change your password after your initial login to enhance security.</p>
            <p>If you encounter any difficulties or have any questions along the way, our support team is here to assist you. Feel free to reach out to us at <a href="mailto:contact@dafera.tech">contact@dafera.tech</a> or by phone at <strong>+234 706 168 1517</strong>.</p>
            <p>Completing the signup process will grant you access to all the features and resources the Dafera platform has to offer, making it easier for ${data.name} to manage and optimize your educational experience.</p>
            <p> We look forward to having ${data.name} as a valued member of our community and are here to support you every step of the way.</p>
        </div>`;

    const html = commonTemplate({ subject, content });

    return { subject, html }
}

export const getTemplate = (payload: SendMailDTO): { subject: string, html: string } => {
    const { type, data } = payload;

    switch (type) {
        case EmailTypes.WELCOME:
            return welcome(data);

        case EmailTypes.INVITE:
            return invite(data);

        case EmailTypes.ACTIVATE:
            return activate(data);

        case EmailTypes.PASSWORD_RESET:
            return passwordRest(data);

        case EmailTypes.SCHOOL_SETUP:
            return schoolSetup(data)

        default:
            break;
    }

}