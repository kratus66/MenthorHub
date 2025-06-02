// src/filter/classes.controller.ts
import {
  Controller,
  Get,
  Query,
  Body,
  Post,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterClassesDto } from './dto/filterClass.dto';
import { PaginationDto } from './dto/PaginationDto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Filtros')

@Controller('filters')
export class FilterController {
  constructor(private readonly classesService: FilterService) {}

  @Post()
  @Roles(Role.Student, Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener clases con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Listado de clases paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiBody({ type: FilterClassesDto })
  async getClasses(
    @Query() pagination: PaginationDto,
    @Body() filters: FilterClassesDto,
  ) {
    try {
      return await this.classesService.findAll(filters, pagination);
    } catch (error) {
      throw new InternalServerErrorException('Error al filtrar las clases');
    }
  }
}