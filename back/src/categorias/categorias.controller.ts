import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesService } from './categorias.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
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
  @ApiOperation({ summary: 'Listar categorías paginadas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado paginado de categorías' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const result = await this.categoriesService.findAll(Number(page), Number(limit));
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


