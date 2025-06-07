import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Investigación sobre el sistema solar',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Instrucciones detalladas para realizar la tarea',
    example: 'Escribe un informe de 2 páginas sobre los planetas gaseosos.',
  })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({
    description: 'Fecha límite para entregar la tarea',
    example: '2025-06-01T23:59:59.000Z',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'UUID de la clase a la que pertenece la tarea',
    example: 'a38c62ec-f39d-45f2-a347-ff7c31a2de92',
  })
  @IsUUID()
  classId: string;
}
