import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { Task } from '../task/task.entity';
import { User } from '../users/user.entity';
import { SubmissionsService } from './submission.service';
import { SubmissionsController } from './submission.controller';
import { UsersModule } from '../users/user.module';
import { Class } from '../classes/class.entity';
import { PaymentsModule } from '../payment/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Task, User, Class]),
    UsersModule,
    PaymentsModule, // ✅ necesario para validar pagos
  ],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
})
export class SubmissionModule {}
