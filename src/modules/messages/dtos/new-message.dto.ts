import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NewMessageDTO {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class MessageRequestDTO extends NewMessageDTO {
  @IsNotEmpty()
  @IsUUID()
  recipient: string;
}
