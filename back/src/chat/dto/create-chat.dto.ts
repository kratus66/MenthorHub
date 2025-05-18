import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    example: '¿Cuándo es la próxima clase?',
    description: 'Contenido del mensaje enviado por el usuario',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'd9c86b17-bccb-45df-a0c5-7eae4cb5c0f1',
    description: 'UUID del usuario que envía el mensaje',
  })
  @IsUUID()
  senderId: string;

  @ApiProperty({
    example: 'fe342f1e-cd78-4aa2-9034-b1a12e7c6a7d',
    description: 'UUID de la clase a la que pertenece el mensaje',
  })
  @IsUUID()
  classId: string;
}

