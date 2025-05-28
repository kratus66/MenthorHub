import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../review/review.entity';
import { ReviewsService } from '../review/reviews.service';
import { ReviewsController } from '../review/reviews.controller';
import { User } from '../users/user.entity';
import { Class } from '../classes/class.entity';
import { PaymentsModule } from '../payment/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, Class]),
    PaymentsModule, // ✅ necesario para validar pagos en el service
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
