import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Role } from '../common/constants/roles.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { RoleGuard } from '../common/guards/role.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Task } from './task.entity';
import { Roles } from '../decorator/role';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.Teacher) // ✅ corregido
  @ApiOperation({ summary: 'Crear una tarea (solo para profesores)' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente', type: Task })
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    try {
      return await this.tasksService.createByTeacher(user.id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la tarea');
    }
  }

  @Get('teacher')
  @Roles(Role.Teacher) // ✅ corregido
  @ApiOperation({ summary: 'Obtener tareas creadas por el profesor autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  async findAllTeacher(@CurrentUser() user: User) {
    try {
      return await this.tasksService.findByTeacher(user.id);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las tareas del profesor');
    }
  }

  @Get('student')
  @Roles(Role.Student) // ✅ corregido
  @ApiOperation({ summary: 'Obtener tareas asignadas al estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  async findAllStudent(@CurrentUser() user: User) {
    try {
      return await this.tasksService.findByStudent(user.id);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las tareas del estudiante');
    }
  }

  @Delete(':id')
  @Roles(Role.Teacher) // ✅ corregido
  @ApiOperation({ summary: 'Eliminar una tarea (solo si pertenece al profesor)' })
  @ApiParam({ name: 'id', description: 'UUID de la tarea a eliminar' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    try {
      return await this.tasksService.deleteIfOwnedByTeacher(user.id, id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la tarea');
    }
  }
}

