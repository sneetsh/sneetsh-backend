import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";

export class UserUpdateDto {
    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsPhoneNumber()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsUrl()
    @IsOptional()
    profile_pic: string;

    @IsString()
    @IsOptional()
    confirm_password: string;
}
