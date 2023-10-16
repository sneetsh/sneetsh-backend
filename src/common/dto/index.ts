import { IsDefined, IsOptional, IsString, IsUUID } from "class-validator";

export class PaginationDTO {
    @IsString()
    @IsOptional()
    page?: string;

    @IsString()
    @IsOptional()
    limit?: string;

    @IsString()
    @IsOptional()
    search?: string;

    @IsUUID()
    @IsOptional()
    id?: string;
}
