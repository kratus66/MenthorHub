import { IsString, IsOptional, IsUUID } from 'class-validator';
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


  @ApiPropertyOptional({
    example: 'a1d0c6e8-2fcf-4b1e-bf41-b0c2460cc071',
    description: 'Nuevo ID de la categoría (UUID)',
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    example: {
      nombre: 'Programación',
      imagen: 'https://ejemplo.com/categoria.jpg',
    },
    description: 'Nueva información visual de la categoría',
  })
  @IsOptional()
  categoryInfo?: {
    nombre: string;
    imagen: string;
  };
}
