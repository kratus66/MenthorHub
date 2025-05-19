// update-class.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiPropertyOptional({
    example: 'Curso de React Avanzado',
    description: 'Nuevo título de la clase',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Este curso cubre hooks personalizados y optimización de rendimiento.',
    description: 'Nueva descripción de la clase',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
