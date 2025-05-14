// src/classes/dto/filter-classes.dto.ts
import { IsOptional, IsString, IsUUID, IsIn, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterClassesDto {
  @ApiPropertyOptional({ description: 'Buscar por nombre (parcial)', example: 'Yoga' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'ID de categoría', example: 'uuid-categoria' })
  @IsOptional()
  @IsUUID()
  category?: string;

  @ApiPropertyOptional({ description: 'ID del profesor', example: 'uuid-profesor' })
  @IsOptional()
  @IsUUID()
  professorId?: string;

  @ApiPropertyOptional({ description: 'Campo por el cual ordenar', example: 'name' })
  @IsOptional()
  @IsIn(['name', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Orden asc o desc', example: 'asc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Página', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Cantidad por página', example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
