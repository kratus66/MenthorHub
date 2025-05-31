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
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { ClassesService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from './class.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { CloudinaryFileInterceptor, CloudinaryMultipleFilesInterceptor } from '../common/interceptors/cloudinary.interceptor';

@ApiTags('Clases')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UseInterceptors(CloudinaryMultipleFilesInterceptor('multimedia'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una nueva clase con multimedia' })
  @ApiBody({ description: 'Datos para crear una clase con archivos multimedia', type: CreateClassDto })
  @ApiResponse({ status: 201, description: 'Clase creada exitosamente', type: Class })
  async create(@Body() createDto: CreateClassDto, @UploadedFiles() files: Express.Multer.File[]) {
    try {
      return await this.classesService.create(createDto, files);
    } catch (error) {
      console.error('❌ Error al crear clase:', error);
      throw new InternalServerErrorException('Error al crear la clase');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases', type: [Class] })
  async findAll() {
    return this.classesService.findAll();
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Obtener todas las clases eliminadas (estado: false)' })
  @ApiResponse({ status: 200, description: 'Lista de clases eliminadas', type: [Class] })
  async findDeleted() {
    return this.classesService.findDeleted();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'UUID de la clase', type: String })
  @ApiResponse({ status: 200, description: 'Clase encontrada', type: Class })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id/restore')
  @ApiOperation({ summary: 'Restaurar una clase eliminada' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiResponse({ status: 200, description: 'Clase restaurada exitosamente', type: Class })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.classesService.restore(id);
    } catch (error) {
      console.error('❌ Error al restaurar clase:', error);
      throw new InternalServerErrorException('Error al restaurar la clase');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una clase existente' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: 200, description: 'Clase actualizada correctamente', type: Class })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateClassDto) {
    try {
      return await this.classesService.update(id, updateDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la clase');
    }
  }

  @Delete(':id/unenroll')
  @ApiOperation({ summary: 'Desinscribir estudiante de una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 200, description: 'Estudiante desinscrito correctamente', type: Class })
  async unenrollStudent(@Param('id', ParseUUIDPipe) classId: string, @Body() { studentId }: EnrollStudentDto) {
    return this.classesService.unenrollStudent(classId, studentId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (lógicamente) una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiResponse({ status: 200, description: 'Clase eliminada correctamente' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.classesService.remove(id);
      return { message: 'Clase eliminada correctamente' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar la clase');
    }
  }

  async findByTeacher(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    try {
      const result = await this.classesService.findByTeacher(id, +page, +limit);
  
      if (result.data.length === 0) {
        return { message: 'El profesor no tiene clases', data: [] };
      }
  
      return result; // ya contiene { data, total, page, limit }
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener clases por profesor');
    }
  }
  

  @Get('student/:id')
  @ApiOperation({ summary: 'Obtener clases por estudiante' })
  @ApiParam({ name: 'id', description: 'UUID del estudiante' })
  @ApiResponse({ status: 200, description: 'Clases encontradas', type: [Class] })
  async findByStudent(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findByStudent(id);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Inscribir estudiante en una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 200, description: 'Estudiante inscrito correctamente', type: Class })
  async enrollStudent(@Param('id', ParseUUIDPipe) classId: string, @Body() { studentId }: EnrollStudentDto) {
    return this.classesService.enrollStudent(classId, studentId);
  }
}


