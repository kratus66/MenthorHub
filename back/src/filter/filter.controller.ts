// src/filter/classes.controller.ts
import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterClassesDto } from './dto/filterClass.dto';
import { PaginationDto } from './dto/PaginationDto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Clases')
@Controller('filters')
export class FilterController {
  constructor(private readonly classesService: FilterService) {}

  @Post()
  @ApiOperation({ summary: 'Obtener clases con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Listado de clases paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiBody({ type: FilterClassesDto })
  async getClasses(
    @Query() pagination: PaginationDto,
    @Body() filters: FilterClassesDto,
  ) {
    return this.classesService.findAll(filters, pagination);
  }
}





