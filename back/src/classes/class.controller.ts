import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseUUIDPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClassesService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Class } from './class.entity';

@ApiTags('Clases')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva clase' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({ status: 201, description: 'Clase creada exitosamente', type: Class })
  async create(@Body() createDto: CreateClassDto) {
    try {
      return await this.classesService.create(createDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la clase');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases', type: [Class] })
  async findAll() {
    try {
      return await this.classesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las clases');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una clase por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiResponse({ status: 200, description: 'Clase encontrada', type: Class })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.classesService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la clase');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una clase existente' })
  @ApiParam({ name: 'id', description: 'UUID de la clase a actualizar' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, description: 'Clase actualizada', type: Class })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateClassDto,
  ) {
    try {
      return await this.classesService.update(id, updateDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la clase');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase a eliminar' })
  @ApiResponse({ status: 200, description: 'Clase eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.classesService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la clase');
    }
  }
}
