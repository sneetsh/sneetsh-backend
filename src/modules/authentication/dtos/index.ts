import {
  IsEmail,
  IsIn,
  IsJWT,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NormalizeEmail } from 'class-sanitizer';
import { capitalizeFirstLetter } from '../../../common/utils';
import { ACCOUNT_TYPE, GENDER } from '../../../common/interfaces';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  identity: string;

  @IsString()
  password: string;
}

export class UserSignupDto {
  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  name: string;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  username: string;

  @IsPhoneNumber()
  phone: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsIn(Object.values(GENDER))
  gender: string;

  @IsEmail()
  @NormalizeEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsIn(Object.values(ACCOUNT_TYPE))
  @Transform(({ value }) => value.toLowerCase())
  account_type: string;

  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  state_of_origin: string;

  @IsString()
  address: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  confirm_password: string;
}

export class resendActivationTokenDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @NormalizeEmail()
  email: string;
}

export class ActivateDTO {
  @IsNumberString()
  otp: string;

  @IsString()
  id: string;
}

export class PhoneNumberVerificationDTO {
  @IsNumberString()
  token: string;

  @IsPhoneNumber()
  phone_number: string;
}

export class PasswordRestEmailRequestDTO {
  @IsEmail()
  @NormalizeEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class PasswordResetDTO {
  @IsNotEmpty()
  token: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AccessTokenRefreshDTO {
  @IsJWT()
  refresh_token: string;

  @IsUUID()
  user_id: string;
}

export class PasswordUpdateDTO {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  confirm_new_password: string;
}
