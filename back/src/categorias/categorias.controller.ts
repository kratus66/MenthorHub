import { Body, Controller, Get, Post, InternalServerErrorException } from '@nestjs/common';
import { CategoriesService } from './categorias.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorías' })
  async findAll() {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las categorías');
    }
  }
}
