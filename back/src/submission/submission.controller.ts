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
// import { Roles } from '../decorator/role'; // ✅ asegúrate que apunta al decorador
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
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Roles(Role.Student)
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
    const classId = req.body.classId || req.body['classId']; // Ajusta según cómo recibas classId

    return await this.submissionsService.create(
      { content: fileUrl, taskId, classId },
      req.user.userId,
    );
  } catch (error) {
    throw new InternalServerErrorException('Error al crear la entrega');
  }
}


  @Get()
  @ApiOperation({ summary: 'Obtener todas las entregas con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.submissionsService.findAll(Number(page), Number(limit));
      if (result.data.length === 0) {
        return { message: 'No se encontraron entregas', ...result };
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las entregas');
    }
  }

  @Get('eliminadas')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.Teacher, Role.Admin)
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
  async findMy(@Req() req: any) {
    try {
      const result = await this.submissionsService.findByStudent(req.user.userId);
      if (result.length === 0) {
        return { message: 'No tienes entregas registradas', data: result };
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener tus entregas');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.submissionsService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la entrega');
    }
  }

  @Put(':id/restore')
  async restore(@Param('id') id: string) {
    try {
      return await this.submissionsService.restore(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al restaurar la entrega');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    try {
      return await this.submissionsService.update(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la entrega');
    }
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(Role.Student, Role.Admin)
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string) {
    try {
      return await this.submissionsService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la entrega');
    }
  }
}



