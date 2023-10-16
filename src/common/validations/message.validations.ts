import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EmailTypes } from "../services/email-templates/auth.template";

export class SendMailDTO {
    @IsIn(Object.values(EmailTypes))
    type: string;

    @IsNotEmpty()
    data?: { [key: string]: string };
}