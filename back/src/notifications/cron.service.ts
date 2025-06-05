// back/src/cron/cron.service.ts
import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And, Between } from 'typeorm'; // Import necessary operators
import { Task } from '../task/task.entity';
import { Notification } from '../notifications/notification.entity';
import { HttpAdapterHost } from '@nestjs/core';
import { Class } from '../classes/class.entity';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);
  private io: any;

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  onModuleInit() {
    const httpServer = this.adapterHost.httpAdapter.getInstance();
    if (httpServer && httpServer.io) {
        this.io = httpServer.io;
    } else {
        this.logger.warn('HttpServer or Socket.IO not available. Socket.IO will not be initialized in CronService.');
    }
  }

  private getSpanishFormattedDate(date: Date): string {
    if (!date || !(date instanceof Date)) {
        return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit', // Optionally add time
      minute: '2-digit', // Optionally add time
    });
  }

  private async getClassName(classId: string): Promise<string> {
    if (!classId) {
        this.logger.warn('getClassName called with null or undefined classId.');
        return 'Clase (ID no provisto)';
    }
    try {
        const classInstance = await this.classRepository.findOne({ where: { id: classId } });
        return classInstance && classInstance.title ? classInstance.title : 'Clase desconocida';
    } catch (error) {
        this.logger.error(`Error fetching class name for ID ${classId}:`, error);
        return 'Clase (error al buscar)';
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async handleDailyNotifications() {
    this.logger.log('⏰ Verificando tareas (vencidas y próximas 24h)...');
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Fetch tasks that are pending, active, and either overdue or due within the next 24 hours.
    const relevantTasks = await this.taskRepository.createQueryBuilder("task")
      .innerJoinAndSelect("task.classRef", "classRef")
      .innerJoinAndSelect("classRef.students", "student")
      .where("task.status = :status", { status: 'pending' })
      .andWhere("task.estado = :estado", { estado: true })
      // Due date is before or at in24Hours (covers overdue and upcoming)
      .andWhere("task.dueDate <= :in24Hours", { in24Hours }) 
      .getMany();

    if (relevantTasks.length === 0) {
      this.logger.log('✅ No hay tareas vencidas o próximas en 24h hoy.');
      return;
    }

    for (const task of relevantTasks) {
      if (!task.classRef || !task.classRef.id) {
        this.logger.warn(`Tarea ${task.id} no tiene classRef o classRef.id. Saltando.`);
        continue;
      }

      const className = await this.getClassName(task.classRef.id);
      const formattedDueDate = this.getSpanishFormattedDate(task.dueDate);
      let message = '';

      if (task.dueDate < now) { // Task is overdue
        message = `¡TAREA VENCIDA!: ${task.title} en "${className}" (venció: ${formattedDueDate})`;
      } else if (task.dueDate >= now && task.dueDate <= in24Hours) { // Task is due within 24 hours
        message = `Próxima entrega (24h): ${task.title} en "${className}" (límite: ${formattedDueDate})`;
      } else {
        // This case should ideally not be hit if query is correct, but as a fallback:
        continue; 
      }

      if (!task.classRef.students || task.classRef.students.length === 0) {
          this.logger.warn(`Tarea ${task.id} (clase ${className}) no tiene estudiantes. Saltando notificaciones.`);
          continue;
      }

      for (const student of task.classRef.students) {
        if (!student || !student.id) {
            this.logger.warn(`Estudiante inválido en tarea ${task.id}. Saltando.`);
            continue;
        }
        this.logger.log(`📢 Notificando a ${student.name || student.id} sobre: ${task.title}`);

        await this.notificationRepository.save({
          user: student,
          message,
        });

        if (this.io) {
            this.io.emit(`notifications:${student.id}`, {
              message,
              date: task.dueDate,
              className: className,
            });
        }
      }
    }
  }

  async getPendingTaskMessagesForUser(userId: string): Promise<{ message: string, taskTitle: string, dueDate: Date, className: string }[]> {
    this.logger.log(`🔍 Verificando tareas (vencidas y próximas 24h) para user ${userId}...`);
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const userTasks = await this.taskRepository.createQueryBuilder("task")
      .innerJoinAndSelect("task.classRef", "classRef")
      .innerJoin("classRef.students", "student")
      .where("student.id = :userId", { userId })
      .andWhere("task.status = :status", { status: 'pending' })
      .andWhere("task.estado = :estado", { estado: true })
      // Due date is before or at in24Hours (covers overdue and upcoming)
      .andWhere("task.dueDate <= :in24Hours", { in24Hours })
      .orderBy("task.dueDate", "ASC")
      .getMany();

    if (userTasks.length === 0) {
      this.logger.log(`✅ No hay tareas vencidas o próximas en 24h para user ${userId}.`);
      return [];
    }

    const messages = [];
    for (const task of userTasks) {
      if (!task.classRef || !task.classRef.id) {
        this.logger.warn(`Tarea ${task.id} para user ${userId} no tiene classRef. Saltando.`);
        continue;
      }
      const className = await this.getClassName(task.classRef.id);
      const formattedDueDate = this.getSpanishFormattedDate(task.dueDate);
      let notificationMessage = '';

      if (task.dueDate < now) { // Task is overdue
        notificationMessage = `¡TAREA VENCIDA!: ${task.title} en "${className}" (venció: ${formattedDueDate})`;
      } else if (task.dueDate >= now && task.dueDate <= in24Hours) { // Task is due within 24 hours
        notificationMessage = `Próxima entrega (24h): ${task.title} en "${className}" (límite: ${formattedDueDate})`;
      } else {
        // Skip tasks not fitting these conditions (e.g. due far in future, though query should limit this)
        continue;
      }
      
      messages.push({
        message: notificationMessage,
        taskTitle: task.title,
        dueDate: task.dueDate,
        className: className,
      });
    }
    return messages;
  }
}
