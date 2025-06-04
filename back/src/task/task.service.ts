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
import { PaymentsService } from '../payment/payment.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    private readonly paymentsService: PaymentsService,
  ) {}

  async createByTeacher(teacherId: string, dto: CreateTaskDto): Promise<Task> {


    // Contar cuántas tareas activas tiene el profesor
    const taskCount = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.classRef', 'class')
      .where('class.teacherId = :teacherId', { teacherId })
      .andWhere('task.estado = true')
      .getCount();

    // Permitir solo una tarea gratis si no es usuario pago
    const teacher = await this.classRepository.manager.getRepository('User').findOne({ where: { id: teacherId } });
    if (!teacher) throw new NotFoundException('Profesor no encontrado');

    if (!teacher.isPaid && taskCount >= 1) {
      throw new ForbiddenException('Debes pagar la suscripción para crear más de una tarea.');
    }

    // Validar pago solo si ya tiene una tarea y quiere crear más
    if (teacher.isPaid) {
      await this.paymentsService.validateUserPaid(teacherId, this.getCurrentMonth());
    }

    const classRef = await this.classRepository.findOne({
      where: { id: dto.classId },
      relations: ['teacher'],
    });

    if (!classRef) {
      console.log('❌ Clase no encontrada');
      throw new NotFoundException('Clase no encontrada');
    }

    console.log('📚 Clase encontrada:', classRef);
    console.log('👨‍🏫 ID del profesor en la clase:', classRef.teacher?.id);

    if (classRef.teacher.id !== teacherId) {
      console.log('⛔ No autorizado: la clase no pertenece al profesor');
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

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

   async getTasksByClassId(classId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { classRef : { id: classId } },
      relations: ['classRef'], // agrega otras relaciones si las necesitás
      order: { dueDate: 'ASC' }, // opcional: ordenar por fecha de entrega
    });
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
