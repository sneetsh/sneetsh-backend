import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class NewMessageDTO {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsUUID()
  recipient: string;
}
