import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { CategoriesModule } from '../categorias/categoria.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categorias/categorias.entity';

import { Class } from '../classes/class.entity';
import { User } from '../users/user.entity';
import { Materias } from '../materias/materias.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Class, User, Materias]),
    CategoriesModule,
    
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
