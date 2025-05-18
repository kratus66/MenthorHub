// src/classes/dto/filter-classes.dto.ts
import { IsOptional, IsString, IsUUID, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterClassesDto {
  @ApiPropertyOptional({
    description: 'Buscar por nombre de clase (título parcial)',
    example: 'Yoga'
  })
  @IsOptional()
  @IsString({ message: 'El valor de búsqueda debe ser un texto' })
  search?: string;

  @ApiPropertyOptional({
    description: 'UUID de la categoría',
    example: 'f3b8c7ee-212d-45cd-aacc-c6fbb989c4a9'
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
  category?: string;

  @ApiPropertyOptional({
    description: 'UUID del profesor',
    example: '0faed3cc-64e2-4c4f-8a7e-4ad8b0a8c1dc'
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del profesor debe ser un UUID válido' })
  teacherId?: string;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar (title o createdAt)',
    enum: ['title', 'createdAt'],
    example: 'title'
  })
  @IsOptional()
  @IsIn(['title', 'createdAt'], {
    message: 'sortBy debe ser "title" o "createdAt"'
  })
  sortBy?: 'title' | 'createdAt';

  @ApiPropertyOptional({
    description: 'Orden ascendente o descendente',
    enum: ['asc', 'desc'],
    example: 'asc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortOrder debe ser "asc" o "desc"'
  })
  sortOrder?: 'asc' | 'desc';
}





