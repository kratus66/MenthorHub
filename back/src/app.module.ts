import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ⬅️ Faltaba esto

import { ChatbotModule } from './chatbot/chatbot.module';
import { ChatModule } from './chat/chat.module';
import { ClassesModule } from './classes/classes.module';
import { User } from './users/user.entity';
import { Class } from './classes/class.entity';
import { Submission } from './submission/submission.entity';
import { Task } from './task/task.entity';
import { PaymentsModule } from './payment/payments.module';
import { Payment } from './payment/payment.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { FilterModule } from './filter/filter.module';
import { TasksModule } from './task/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notification.entity';
import { Category } from './entities/categorias.entities';
import { CategoriesModule } from './categorias/categoria.module';
import { SubmissionModule } from './submission/submission.module';
import { Professor } from './entities/professor.entities';
import { SeederModule } from './seeder/seeder.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }), // ✅ Agregado

      FilterModule,
      ChatbotModule,
      ChatModule,
      ClassesModule,
      PaymentsModule,
      AuthModule,
      TasksModule,
      NotificationsModule,
      CategoriesModule,
      SubmissionModule,

      TypeOrmModule.forRoot({
         type: 'postgres',
         host: process.env.DB_HOST,
         port: parseInt(process.env.DB_PORT || '5432'),
         username: process.env.DB_USERNAME,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME,
         entities: [
            User,
            Class,
            Task,
            Submission,
            Payment,
            Notification,
            Category,
         ],
         synchronize: true,
      }),
   ],
})
export class AppModule {}
