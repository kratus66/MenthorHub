import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Class } from '../classes/class.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async createByTeacher(teacherId: string, dto: CreateTaskDto): Promise<Task> {
    const classRef = await this.classRepository.findOne({
      where: { id: dto.classId },
      relations: ['teacher'],
    });

    if (!classRef || classRef.teacher.id !== teacherId) {
      throw new ForbiddenException('No puedes crear tareas para esta clase');
    }

    const task = this.taskRepository.create({
      title: dto.title,
      instructions: dto.instructions,
      dueDate: new Date(dto.dueDate),
      classRef,
    });

    return this.taskRepository.save(task);
  }

  async findByTeacher(teacherId: string, page = 1, limit = 10): Promise<Task[]> {
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.classRef', 'class')
      .where('class.teacherId = :teacherId AND task.estado = true', { teacherId })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findByStudent(studentId: string, page = 1, limit = 10): Promise<Task[]> {
    return this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.classRef', 'class')
      .leftJoin('class.students', 'student')
      .where('student.id = :studentId AND task.estado = true', { studentId })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

      async findEliminadasByTeacher(
      teacherId: string,
      page = 1,
      limit = 10
    ): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
      const [data, total] = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.classRef', 'class')
        .where('class.teacherId = :teacherId AND task.estado = false', { teacherId })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return { data, total, page, limit };
    }


  async deleteIfOwnedByTeacher(teacherId: string, taskId: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['classRef', 'classRef.teacher'],
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.classRef.teacher.id !== teacherId) {
      throw new ForbiddenException('No puedes borrar esta tarea');
    }

    task.estado = false;
    task.fechaEliminado = new Date();

    await this.taskRepository.save(task);
  }

  async findOne(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['classRef'],
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
    return task;
  }

  async restore(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    task.estado = true;
    task.fechaEliminado = null;

    return this.taskRepository.save(task);
  }

  

  async updateByTeacher(
    teacherId: string,
    taskId: string,
    dto: Partial<UpdateTaskDto>
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['classRef', 'classRef.teacher'],
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');
    if (task.classRef.teacher.id !== teacherId) {
      throw new ForbiddenException('No puedes editar esta tarea');
    }

    Object.assign(task, dto);

    return this.taskRepository.save(task);
  }
}
