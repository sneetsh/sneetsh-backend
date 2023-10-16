import { Transform } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { ActiveStatusEnum } from "../entities/role.entity";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(Object.values(ActiveStatusEnum))
  status: string;

  @IsArray()
  @IsUUID(null, { each: true })
  permissions: string[];
}

export class UpdateRoleDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsIn(Object.values(ActiveStatusEnum))
  status: string;

  @IsArray()
  @IsUUID(null, { each: true })
  @IsOptional()
  permissions: string[];
}
