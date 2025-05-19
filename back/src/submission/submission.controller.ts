// src/submission/submissions.controller.ts
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
} from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Express } from 'express';



import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CloudinaryFileInterceptor } from '../common/interceptors/cloudinary.interceptor';


@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student')
  @UseInterceptors(CloudinaryFileInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una entrega con archivo (solo estudiantes)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: { type: 'integer', example: 1 },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Entrega creada exitosamente' })
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('taskId') taskId: number,
    @Req() req: any,
  ) {
    const fileUrl = file?.path;
    return this.submissionsService.create(
      { content: fileUrl, taskId: taskId },
      req.user.userId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Obtener todas las entregas (solo profesores/admin)' })
  @ApiResponse({ status: 200, description: 'Listado de entregas' })
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student')
  @ApiOperation({ summary: 'Obtener entregas del estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Entregas del usuario autenticado' })
  findMy(@Req() req: any) {
    return this.submissionsService.findByStudent(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una entrega por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega encontrada' })
  @ApiResponse({ status: 404, description: 'Entrega no encontrada' })
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'Actualizar una entrega (solo profesor/admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiBody({ type: UpdateSubmissionDto })
  @ApiResponse({ status: 200, description: 'Entrega actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student', 'admin')
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}