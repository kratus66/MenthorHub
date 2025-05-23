import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Salud', description: 'Nombre de la categoría' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://ejemplo.com/categoria.jpg', description: 'URL de la imagen de la categoría' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 'Descripción de la categoría', description: 'Descripción de la categoría' })
  @IsString()
  description: string;
}