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
    const pendingTasks = await this.taskRepository.find({
      where: {
        ...(Object.prototype.hasOwnProperty.call(this.taskRepository.metadata.propertiesMap, 'status') && {
          status: 'pending',
        }),
        ...(Object.prototype.hasOwnProperty.call(this.taskRepository.metadata.propertiesMap, 'dueDate') && {
          dueDate: LessThanOrEqual(today),
        }),
      },
      relations: ['student'],
    });

    if (pendingTasks.length === 0) {
      this.logger.log('✅ No hay tareas pendientes hoy.');
      return;
    }

    for (const task of pendingTasks) {
      const message = `Tienes pendiente: ${task.title} (fecha límite: ${task.dueDate.toDateString()})`;


      // Log en consola
      console.log(`📢 ${task.student?.name} tiene pendiente: ${task.title} (fecha límite: ${task.dueDate})`);


      // Guardar en base de datos
      await this.notificationRepository.save({
        user: task.student,
        message,
      });

      // Emitir por socket en tiempo real
      this.io.emit(`notifications:${task.student.id}`, {
        message,
        date: task.dueDate,
      });
    }
  }
}
