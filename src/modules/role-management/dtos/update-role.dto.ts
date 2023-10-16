import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';

enum StatusType {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsEnum(StatusType)
    status: StatusType;
}
