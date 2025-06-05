import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronService } from './cron.service';
import { Task } from '../task/task.entity';
import { Notification } from '../notifications/notification.entity';
import { User } from '../users/user.entity';
import { NotificationsController } from './notifications.controller';
import { Class } from '../classes/class.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Task, Notification, User, Class],),
  ],
  providers: [CronService],
  controllers: [NotificationsController], 
})
export class NotificationsModule {}
