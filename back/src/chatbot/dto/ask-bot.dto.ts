import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AskBotDto {
  @ApiProperty({
    example: '¿Cuál es la capital de Colombia?',
    description: 'Mensaje que el usuario envía al chatbot',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

