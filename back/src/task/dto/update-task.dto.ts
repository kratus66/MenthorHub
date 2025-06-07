import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Nuevo título de la tarea',
    example: 'Presentación sobre los planetas',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nuevas instrucciones para la tarea',
    example: 'Crear una presentación en PowerPoint con al menos 5 diapositivas.',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Nueva fecha límite para entregar la tarea',
    example: '2025-06-10T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

