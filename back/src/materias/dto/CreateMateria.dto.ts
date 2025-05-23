import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMateriaDto {
  @ApiProperty({ example: 'Matemáticas', description: 'Nombre de la materia' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 'https://ejemplo.com/materia.jpg', description: 'URL de la imagen de la materia' })
  @IsString()
  imagenUrl: string;

  @ApiProperty({ example: 'Descripción de la materia', description: 'Descripción de la materia' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Categoria de la materia', description: 'Categoria de la materia' })
  @IsString()
  category: string;
}