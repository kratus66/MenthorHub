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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../decorator/roles.enum'; // asegúrate que este enum tiene TEACHER, STUDENT
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.TEACHER) // corregido: TEACHER
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.createByTeacher(user.id, dto);
  }

  @Get('teacher')
  @Roles(Role.TEACHER) // corregido: TEACHER
  findAllTeacher(@CurrentUser() user: User) {
    return this.tasksService.findByTeacher(user.id);
  }

  @Get('student')
  @Roles(Role.STUDENT) // corregido: STUDENT
  findAllStudent(@CurrentUser() user: User) {
    return this.tasksService.findByStudent(user.id);
  }

  @Delete(':id')
  @Roles(Role.TEACHER) // corregido: TEACHER
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tasksService.deleteIfOwnedByTeacher(user.id, +id);
  }
}
