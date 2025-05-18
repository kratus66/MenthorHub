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
} from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Submissions')
@ApiBearerAuth('JWT-auth')
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student')
  @ApiOperation({ summary: 'Crear una entrega de tarea (solo estudiantes)' })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({ status: 201, description: 'Entrega creada exitosamente' })
  create(@Body() dto: CreateSubmissionDto, @Req() req: any) {
    return this.submissionsService.create(dto, req.user.userId);
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

