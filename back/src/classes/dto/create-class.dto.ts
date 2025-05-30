import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @ApiProperty({ example: 'Curso de Introducción a NestJS', type: 'string' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Este curso enseña los fundamentos de NestJS...', type: 'string' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'uuid-de-la-materia', type: 'string', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  materiaId!: string;

  @ApiProperty({ example: 'uuid-del-profesor', type: 'string', format: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  teacherId?: string;

  @ApiProperty({ example: 'uuid-de-la-categoria', type: 'string', format: 'uuid', required: false })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Información de la categoría',
    example: {
      nombre: 'Programación',
      imagen: 'https://ejemplo.com/categoria.jpg',
    },
    type: 'object',
    required: false,
  })
  @IsOptional()
  categoryInfo?: {
    nombre: string;
    imagen: string;
  };

  @ApiProperty({ example: 'Tecnología', type: 'string' })
  @IsString()
  @IsNotEmpty()
  sector!: string;

  @ApiProperty({
    description: 'Archivos multimedia a subir',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  @Type(() => Object)
  multimedia?: any;
}
