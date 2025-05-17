import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  classId: string;
}
