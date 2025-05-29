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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(CloudinaryFileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una entrega con archivo (solo estudiantes)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', example: 'uuid-task-ejemplo' },
        classId: { type: 'string', example: 'uuid-class-ejemplo' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Entrega creada exitosamente' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubmissionDto,
    @Req() req: any,
  ) {
    try {
      const fileUrl = file?.path;
      if (!fileUrl) {
        throw new InternalServerErrorException('Archivo no válido o no se pudo subir');
      }

      return await this.submissionsService.create(
        { ...dto, content: fileUrl },
        req.user.sub,
      );
    } catch (error) {
      console.error('❌ Error al crear entrega:', error);
      throw new InternalServerErrorException('Error al crear la entrega');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las entregas con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.submissionsService.findAll(Number(page), Number(limit));
  }

  @Get('eliminadas')
  @ApiOperation({ summary: 'Obtener entregas eliminadas (profesor/admin)' })
  @ApiResponse({ status: 200, description: 'Listado de entregas eliminadas' })
  async findEliminadas() {
    return this.submissionsService.findEliminadas();
  }

  @Get('my-submissions')
  async findMy(@Req() req: any) {
    return this.submissionsService.findByStudent(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Put(':id/restore')
  async restore(@Param('id') id: string) {
    return this.submissionsService.restore(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}




