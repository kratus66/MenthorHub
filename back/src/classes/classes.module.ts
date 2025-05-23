import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './class.service';
import { ClassesController } from './class.controller';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../categorias/categorias.entity';
import { Materias } from '../materias/materias.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Class, User, Category, Materias])], 
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}

