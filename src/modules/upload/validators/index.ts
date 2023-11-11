import { IsArray, Matches } from "class-validator";

export class Base64FilesDTO {
    @IsArray()
    @Matches(/(data:image\/[^;]+;base64[^"]+)/i, {
        each: true,
        message: 'Input must be a valid base64 URI',
    })
    files: string[];
}