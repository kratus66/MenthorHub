import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    example: 'Esta es mi respuesta a la tarea...',
    description: 'Contenido enviado por el usuario como respuesta a una tarea',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'f3b8c7ee-212d-45cd-aacc-c6fbb989c4a9',
    description: 'UUID de la tarea a la que corresponde la entrega',
  })
  @IsUUID('4', { message: 'taskId debe ser un UUID válido' })
  taskId: number;
}
