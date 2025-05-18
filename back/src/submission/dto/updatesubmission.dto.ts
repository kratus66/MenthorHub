import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubmissionDto {
  @ApiPropertyOptional({
    example: 'Respuesta actualizada del estudiante',
    description: 'Contenido de la entrega (opcional)',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 95,
    description: 'Nota asignada a la entrega (opcional)',
  })
  @IsOptional()
  @IsNumber()
  grade?: number;

  @ApiPropertyOptional({
    example: 'Muy buen trabajo, solo revisa los últimos puntos.',
    description: 'Retroalimentación del profesor (opcional)',
  })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la entrega ya fue calificada',
  })
  @IsOptional()
  @IsBoolean()
  isGraded?: boolean;
}

