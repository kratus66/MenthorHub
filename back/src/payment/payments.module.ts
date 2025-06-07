import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payment.service';
import { Payment } from './payment.entity';
import { User } from '../users/user.entity';

import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]),EmailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],

})
export class PaymentsModule {}
