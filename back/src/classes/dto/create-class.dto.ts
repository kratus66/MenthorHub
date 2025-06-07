import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Curso de Introducción a NestJS' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Este curso enseña los fundamentos de NestJS...' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'uuid-de-la-materia', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  materiaId!: string;

  @ApiProperty({ example: 'uuid-del-profesor', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({ example: 'uuid-de-la-categoria', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
