// src/cron/cron.service.ts
import {
  Injectable,
  Logger,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Task } from '../task/task.entity';
import { Notification } from '../notifications/notification.entity';
import { HttpAdapterHost } from '@nestjs/core';


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
  ) {}

  onModuleInit() {
    const httpServer = this.adapterHost.httpAdapter.getInstance();
    this.io = httpServer.io; // accede a la instancia global de Socket.IO
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async handleDailyNotifications() {
    this.logger.log('⏰ Verificando tareas pendientes...');
  
    const today = new Date();
  
    // Traer tareas pendientes con la clase y sus estudiantes
    const pendingTasks = await this.taskRepository.find({
      where: {
        status: 'pending',
        dueDate: LessThanOrEqual(today),
        estado: true,
      },
      relations: ['classRef', 'classRef.students'],
    });
  
    if (pendingTasks.length === 0) {
      this.logger.log('✅ No hay tareas pendientes hoy.');
      return;
    }
  
    for (const task of pendingTasks) {
      const message = `Tienes pendiente: ${task.title} (fecha límite: ${task.dueDate.toDateString()})`;
  
      // Asegurarse que la clase y sus estudiantes existan
      if (!task.classRef || !task.classRef.students) continue;
  
      for (const student of task.classRef.students) {
        this.logger.log(`📢 Notificando a ${student.name} sobre la tarea ${task.title}`);
  
        // Guardar la notificación
        await this.notificationRepository.save({
          user: student,
          message,
        });
  
        // Emitir por socket
        this.io.emit(`notifications:${student.id}`, {
          message,
          date: task.dueDate,
        });
      }
    }
  }
}
