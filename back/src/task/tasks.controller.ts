import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../decorator/roles.enum';
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

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Crear una tarea (solo para profesores)' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente', type: Task })
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.createByTeacher(user.id, dto);
  }

  @Get('teacher')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Obtener tareas creadas por el profesor autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  findAllTeacher(@CurrentUser() user: User) {
    return this.tasksService.findByTeacher(user.id);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Obtener tareas asignadas al estudiante autenticado' })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  findAllStudent(@CurrentUser() user: User) {
    return this.tasksService.findByStudent(user.id);
  }

  @Delete(':id')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Eliminar una tarea (solo si pertenece al profesor)' })
  @ApiParam({ name: 'id', description: 'UUID de la tarea a eliminar' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.deleteIfOwnedByTeacher(user.id, id);
  }
}

