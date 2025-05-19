import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseUUIDPipe,
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
  create(@Body() createDto: CreateClassDto) {
    return this.classesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases', type: [Class] })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una clase por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiResponse({ status: 200, description: 'Clase encontrada', type: Class })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una clase existente' })
  @ApiParam({ name: 'id', description: 'UUID de la clase a actualizar' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, description: 'Clase actualizada', type: Class })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateClassDto) {
    return this.classesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase a eliminar' })
  @ApiResponse({ status: 200, description: 'Clase eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Clase no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.remove(id);
  }
}

