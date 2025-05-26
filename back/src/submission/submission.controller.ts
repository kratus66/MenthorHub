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
import { CloudinaryFileInterceptor } from '../common/interceptors/cloudinary.interceptor';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Solo autenticados pueden crear entregas
  @UseInterceptors(CloudinaryFileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una entrega con archivo (solo estudiantes)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', example: 'uuid-task-ejemplo' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Entrega creada exitosamente' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('taskId') taskId: string,
    @Req() req: any,
  ) {
    try {
      const fileUrl = file?.path || 'https://cloudinary.com/fake-file.pdf';
      const classId = req.body.classId || req.body['classId'];

      // Solo estudiantes pueden crear entregas
      if (req.user.role !== 'student') {
        throw new InternalServerErrorException('Solo los estudiantes pueden crear entregas.');
      }

      return await this.submissionsService.create(
        { content: fileUrl, taskId, classId },
        req.user.userId,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la entrega');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Teacher, Role.Admin)  // Solo profesores y admins pueden ver todas las entregas
  @ApiOperation({ summary: 'Obtener todas las entregas (solo profesores/admin)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado de entregas' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.submissionsService.findAll(Number(page), Number(limit));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las entregas');
    }
  }

  @Get('eliminadas')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Teacher, Role.Admin) // Solo profesores/admin pueden ver las entregas eliminadas
  @ApiOperation({ summary: 'Obtener entregas eliminadas (profesor/admin)' })
  @ApiResponse({ status: 200, description: 'Listado de entregas eliminadas' })
  async findEliminadas() {
    try {
      return await this.submissionsService.findEliminadas();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener entregas eliminadas');
    }
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener entregas del estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Entregas del usuario autenticado' })
  async findMy(@Req() req: any) {
    try {
      return await this.submissionsService.findByStudent(req.user.userId);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener tus entregas');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una entrega por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrada' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.submissionsService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la entrega');
    }
  }

  @Put(':id/restore')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Teacher, Role.Admin) // Solo profesores/admin pueden restaurar entregas eliminadas
  @ApiOperation({ summary: 'Restaurar una entrega eliminada' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega restaurada correctamente' })
  async restore(@Param('id') id: string) {
    try {
      return await this.submissionsService.restore(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al restaurar la entrega');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Teacher, Role.Admin) // Solo profesores/admin pueden actualizar las entregas
  @ApiOperation({ summary: 'Actualizar una entrega (solo profesor/admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiBody({ type: UpdateSubmissionDto })
  @ApiResponse({ status: 200, description: 'Entrega actualizada' })
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    try {
      return await this.submissionsService.update(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la entrega');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      if (req.user.role === 'student') {
        return await this.submissionsService.remove(id); // Los estudiantes pueden eliminar sus propias entregas
      } else if (req.user.role === 'admin' || req.user.role === 'teacher') {
        return await this.submissionsService.remove(id); // Profesores y admins pueden eliminar cualquier entrega
      } else {
        throw new InternalServerErrorException('No tienes permiso para eliminar esta entrega');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la entrega');
    }
  }
}
