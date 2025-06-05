import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
  Query,
  BadRequestException,
  NotFoundException, // Asegúrate de importar NotFoundException si lo usas
} from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Role } from '../common/constants/roles.enum';
import { Express } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { CloudinarySubmissionsInterceptor } from '../common/interceptors/cloudinary.interceptor';
import { Roles } from '../common/decorators/role';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(
    private submissionsService: SubmissionsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(CloudinarySubmissionsInterceptor('file'))
  @ApiOperation({ summary: 'Crear una nueva entrega' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSubmissionDto }) // Asegúrate que CreateSubmissionDto esté bien definido para Swagger
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubmissionDto,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Archivo es obligatorio');
    }
    const uploadResult = await this.cloudinaryService.uploadFile(file.buffer, {
      folder: `mentorhub/entregas`, // Considera una estructura de carpetas más específica si es necesario
    });
    return this.submissionsService.createSubmission(dto, uploadResult.secure_url, req.user.sub);
    
  }

  @Get()
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener todas las entregas con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.submissionsService.findAll(Number(page), Number(limit));
  }

  // NUEVO ENDPOINT PARA OBTENER ENTREGAS POR TASK ID
  @Get('task/:taskId')
  @Roles(Role.Teacher, Role.Admin) // Ajusta los roles según quién puede acceder
  @ApiOperation({ summary: 'Obtener todas las entregas para una tarea específica' })
  @ApiParam({ name: 'taskId', description: 'UUID de la tarea', type: String })
  @ApiResponse({ status: 200, description: 'Listado de entregas para la tarea' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada o sin entregas' })
  async findByTask(@Param('taskId') taskId: string) {
    if (!taskId) { // Validación básica
      throw new BadRequestException('Task ID es obligatorio');
    }
    const submissions = await this.submissionsService.findByTask(taskId);
    // Puedes decidir si devolver un array vacío o un 404 si no hay entregas.
    // Por consistencia con el frontend que espera un array, devolver un array vacío es común.
    // if (!submissions || submissions.length === 0) {
    //   throw new NotFoundException(`No se encontraron entregas para la tarea con ID ${taskId}`);
    // }
    return submissions;
  }

  @Get('eliminadas')
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener entregas eliminadas (profesor/admin)' })
  @ApiResponse({ status: 200, description: 'Listado de entregas eliminadas' })
  async findEliminadas() {
    return this.submissionsService.findEliminadas();
  }

  @Get('my-submissions')
  @Roles(Role.Student) // Solo los estudiantes pueden ver sus propias entregas
  @ApiOperation({ summary: 'Obtener entregas propias del estudiante autenticado' })
  async findMy(@Req() req: any) {
    // Asegúrate que tu servicio submissionsService tenga un método para esto,
    // por ejemplo, findByStudentId(studentId: string)
    return this.submissionsService.findByStudent(req.user.sub);
  }

  @Get(':id')
  @Roles(Role.Student, Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener una entrega por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega', type: String })
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Put(':id/restore')
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Restaurar una entrega eliminada' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega a restaurar', type: String })
  async restore(@Param('id') id: string) {
    return this.submissionsService.restore(id);
  }

  @Put(':id')
  @Roles(Role.Student) // Asumo que solo el estudiante puede actualizar su entrega, o ajusta según sea necesario
  @ApiOperation({ summary: 'Actualizar una entrega (solo estudiante)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega a actualizar', type: String })
  @ApiBody({ type: UpdateSubmissionDto })
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    // Aquí podrías necesitar manejar archivos también si la actualización lo permite
    return this.submissionsService.update(id, dto);
  }
  
  // Endpoint para que el profesor califique/actualice múltiples entregas de una tarea
  @Put('task/:taskId/grades')
  @Roles(Role.Teacher, Role.Admin) // Solo profesores o admins pueden calificar
  @ApiOperation({ summary: 'Calificar múltiples entregas para una tarea' })
  @ApiParam({ name: 'taskId', description: 'UUID de la tarea cuyas entregas se calificarán' })
  @ApiBody({
    description: 'Array de objetos con id de entrega y calificación',
    schema: {
      type: 'object',
      properties: {
        submissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              grade: { type: 'number', nullable: true },
            },
            required: ['id'],
          },
        },
      },
    },
  })
  async updateGradesForTask(
    @Param('taskId') taskId: string,
    @Body('submissions') submissionsToGrade: Array<{ id: string; grade: number | null }>,
    @Req() req: any, // Para verificar que el profesor es el de la tarea, si es necesario
  ) {
    if (!submissionsToGrade || submissionsToGrade.length === 0) {
      throw new BadRequestException('Se requiere un listado de entregas para calificar.');
    }
    // Aquí llamarías a un método en tu servicio, por ejemplo:
    // return this.submissionsService.updateGrades(taskId, submissionsToGrade, req.user.sub);
    // Este método en el servicio iteraría sobre submissionsToGrade y actualizaría cada entrega.
    // Asegúrate de que el servicio valide que el profesor tiene permiso sobre la tarea.
    return this.submissionsService.updateGrades(taskId, submissionsToGrade); // Simplificado por ahora
  }


  @Delete(':id')
  @Roles(Role.Student, Role.Admin)
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}
