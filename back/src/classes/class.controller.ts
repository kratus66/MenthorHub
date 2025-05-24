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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from './class.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../decorator/role';
import { Role } from '../common/constants/roles.enum';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@ApiTags('Clases')
@ApiBearerAuth('JWT-auth')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

@Post()
/* @UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.Teacher, Role.Admin) */
@UseInterceptors(AnyFilesInterceptor())
@ApiConsumes('multipart/form-data')
@ApiOperation({ summary: 'Crear una nueva clase con multimedia' })
@ApiBody({
  description: 'Datos para crear una clase con archivos multimedia',
  type: CreateClassDto,
})
@ApiResponse({ status: 201, description: 'Clase creada exitosamente', type: Class })
async create(
  @Body() createDto: CreateClassDto,
  @UploadedFiles() files: Express.Multer.File[],
) {
  // 👇 LOGS TEMPORALES PARA DEPURACIÓN
  console.log('✅ DTO recibido:', createDto);
  console.log('📎 Archivos recibidos:', files);

  try {
    return await this.classesService.create(createDto, files);
  } catch (error) {
    console.error('❌ Error al crear clase:', error);
    throw new InternalServerErrorException('Error al crear la clase');
  }
}


  @Get()
  /* @UseGuards(JwtAuthGuard) // Solo autenticados pueden ver clases */
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases', type: [Class] })
  async findAll() {
    return this.classesService.findAll();
  }
     @Get('deleted')
  /* @UseGuards(JwtAuthGuard, RoleGuard) 
  @Roles(Role.Admin) */
  @ApiOperation({ summary: 'Obtener todas las clases eliminadas (estado: false)' })
  @ApiResponse({ status: 200, description: 'Lista de clases eliminadas', type: [Class] })
  async findDeleted() {
    return this.classesService.findDeleted();
  }

  @Get(':id')
  /* @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una clase por ID' }) */
  @ApiParam({ name: 'id', description: 'UUID de la clase', type: String })
  @ApiResponse({ status: 200, description: 'Clase encontrada', type: Class })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id/restore')
/* @UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.Admin) */
@ApiOperation({ summary: 'Restaurar una clase eliminada (estado: false → true)' })
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
   /*  @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Teacher, Role.Admin) */
    @ApiOperation({ summary: 'Actualizar una clase existente' })
    @ApiParam({ name: 'id', description: 'UUID de la clase' })
    @ApiBody({ type: UpdateClassDto })
    @ApiResponse({ status: 200, description: 'Clase actualizada correctamente', type: Class })
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateDto: UpdateClassDto
    ) {
      try {
        return await this.classesService.update(id, updateDto);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Error al actualizar la clase');
      }
    }
    @Delete(':id/unenroll')
    // @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Desinscribir estudiante de una clase' })
    @ApiParam({ name: 'id', description: 'UUID de la clase' })
    @ApiBody({ type: EnrollStudentDto })
    @ApiResponse({ status: 200, description: 'Estudiante desinscrito correctamente', type: Class })
    async unenrollStudent(
      @Param('id', ParseUUIDPipe) classId: string,
      @Body() { studentId }: EnrollStudentDto
    ) {
      return this.classesService.unenrollStudent(classId, studentId);
    }


@Delete(':id')
/* @UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.Admin) */
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

  
    @Get('teacher/:id')
 /*  @UseGuards(JwtAuthGuard) */
  @ApiOperation({ summary: 'Obtener clases dictadas por un profesor' })
  @ApiParam({ name: 'id', description: 'UUID del profesor' })
  @ApiResponse({ status: 200, description: 'Clases encontradas', type: [Class] })
  async findByTeacher(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findByTeacher(id);
  }

  

    @Get('student/:id')
  /* @UseGuards(JwtAuthGuard) */
  @ApiOperation({ summary: 'Obtener clases inscritas por un estudiante' })
  @ApiParam({ name: 'id', description: 'UUID del estudiante' })
  @ApiResponse({ status: 200, description: 'Clases encontradas', type: [Class] })
  async findByStudent(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findByStudent(id);
  }
  

  @Post(':id/enroll')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Inscribir estudiante en una clase' })
  @ApiParam({ name: 'id', description: 'UUID de la clase' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 200, description: 'Estudiante inscrito correctamente', type: Class })
  async enrollStudent(
    @Param('id', ParseUUIDPipe) classId: string,
    @Body() { studentId }: EnrollStudentDto
  ) {
    return this.classesService.enrollStudent(classId, studentId);
  }


}
