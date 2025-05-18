import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({
    example: 'Curso de Introducción a NestJS',
    description: 'Título de la clase',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Este curso enseña los fundamentos de NestJS con ejemplos prácticos.',
    description: 'Descripción de la clase',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: '5f7c0b64-2f99-4a8c-b547-fca6a2d5a8cb',
    description: 'ID del profesor (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({
    example: 'a1d0c6e8-2fcf-4b1e-bf41-b0c2460cc071',
    description: 'ID de la categoría (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}

