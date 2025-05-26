import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './class.service';
import { ClassesController } from './class.controller';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../categorias/categorias.entity';
import { Materias } from '../materias/materias.entity';
import { Payment } from '../payment/payment.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Class, User, Category, Materias,Payment])], 
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}

