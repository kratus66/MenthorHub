import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { Task } from './task.entity';
import { Roles } from '../common/decorators/role';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.Teacher)
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

  @Get('eliminadas')
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Ver tareas eliminadas del profesor autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado de tareas eliminadas', type: [Task] })
  async findEliminadas(
    @CurrentUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    try {
      if (!user) throw new UnauthorizedException('No autenticado');
      const tasks = await this.tasksService.findEliminadasByTeacher(user.id, Number(page), Number(limit));
      if (tasks.data.length === 0) {
        return { message: 'No se encontraron tareas asignadas', ...tasks };
      }
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener tareas eliminadas');
    }
  }

  @Get('teacher')
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Obtener tareas del profesor con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  async findAllTeacher(
    @CurrentUser() user: User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      if (!user) throw new UnauthorizedException('No autenticado');
      const tasks = await this.tasksService.findByTeacher(user.id, parseInt(page), parseInt(limit));
      if (!tasks.length) return { message: 'No se encontraron tareas' };
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las tareas del profesor');
    }
  }

  @Get('student')
  @Roles(Role.Student)
  @ApiOperation({ summary: 'Obtener tareas asignadas al estudiante autenticado' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado de tareas', type: [Task] })
  async findAllStudent(
    @CurrentUser() user: User,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      if (!user) throw new UnauthorizedException('No autenticado');
      const tasks = await this.tasksService.findByStudent(user.id, parseInt(page), parseInt(limit));
      if (!tasks.length) return { message: 'No se encontraron tareas asignadas' };
      return tasks;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las tareas del estudiante');
    }
  }

  @Delete(':id')
  @Roles(Role.Teacher)
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

  @Put(':id/restore')
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Restaurar una tarea eliminada' })
  @ApiParam({ name: 'id', description: 'UUID de la tarea' })
  @ApiResponse({ status: 200, description: 'Tarea restaurada exitosamente', type: Task })
  async restore(@Param('id') id: string) {
    try {
      return await this.tasksService.restore(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al restaurar la tarea');
    }
  }

  @Put(':id')
  @Roles(Role.Teacher)
  @ApiOperation({ summary: 'Actualizar una tarea (solo el profesor dueño)' })
  @ApiParam({ name: 'id', description: 'UUID de la tarea' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada exitosamente', type: Task })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.tasksService.updateByTeacher(user.id, id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }
}
