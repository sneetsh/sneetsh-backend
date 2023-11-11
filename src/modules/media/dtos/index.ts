import { Transform } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { MEDIA_TYPE } from "src/common/interfaces";

export class AddSongDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsUrl()
    cover: string;

    @IsUrl()
    file: string;

    @IsString()
    @IsNotEmpty()
    label: string;

    @IsArray()
    @IsOptional()
    tags: string[];

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsOptional()
    @IsString()
    duration: string;

    @IsIn(Object.values(MEDIA_TYPE))
    @Transform(({ value }) => value?.toLowerCase())
    type: string;

    @IsOptional()
    @IsString()
    album: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    features: string;
}
