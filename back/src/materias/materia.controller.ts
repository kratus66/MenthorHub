import { Body, Controller, Get, Post, InternalServerErrorException } from '@nestjs/common';
import { MateriasService } from './materia.service';
import { CreateMateriaDto } from './dto/CreateMateria.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Materias')
@Controller('materias')
export class MateriasController {
    constructor(private readonly materiasService: MateriasService) {}   

  @Post()
  @ApiOperation({ summary: 'Crear Materia' })
  @ApiResponse({ status: 201, description: 'Materia creada' })
  async create(@Body() dto: CreateMateriaDto) {
    try {
      return await this.materiasService.create(dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la materia');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar materias' })
  async findAll() {
    try {
      return await this.materiasService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las materias');
    }
  }
}
