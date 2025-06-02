import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categorias.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Categorías')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada' })
  async create(@Body() dto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(dto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al crear la categoría';
      throw new InternalServerErrorException(message);
    }
  }

  @Get()
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Listar categorías paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado paginado de categorías' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const result = await this.categoriesService.findAll(page, limit);
      if (result.data.length === 0) {
        return {
          message: 'No se encontraron categorías',
          ...result,
        };
      }
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al obtener las categorías';
      throw new InternalServerErrorException(message);
    }
  }
}